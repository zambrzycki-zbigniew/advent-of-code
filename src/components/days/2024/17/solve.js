export function solvePart1(A, B, C, program) {
    const device = new Device(A, B, C, program)
    device.findPaths();
    console.log(device.paths)
    return device.execute()
}

//2,4 - bst, this.B = this.A % 8
//1,1 - bxl, this.B = this.B ^ 1
//7,5 - cdv, this.C = Math.trunc(this.A / Math.pow(2, this.B))
//0,3 - adv, this.A = Math.trunc(this.A / 8)
//1,4 - bxl, this.B = this.B ^ 4
//4,0 - bxc, this.B = this.B ^ this.C
//5,5 - out, this.output.push(this.B % 8)
//3,0 - jnz, if A !== 0 go to start

//B'
//B2 = this.A % 8
//B2 = (this.A % 8) ^ 1

//C'
//C2 = Math.trunc(this.A / Math.pow(2, (this.A % 8) ^ 1))

//A'
//A2 = Math.trunc(this.A / 8)

//B'
//B2 = (((this.A % 8) ^ 1) ^ 4) ^ (Math.trunc(this.A / Math.pow(2, (this.A % 8) ^ 1)))

//OUT = (((this.A % 8) ^ 1) ^ 4) ^ (Math.trunc(this.A / Math.pow(2, (this.A % 8) ^ 1))) % 8
export function solvePart2(A, B, C, program) {
    console.log(A, B, C, program)
    return findMinimalA(program)
}

class Device {
    constructor(A, B, C, program) {
        this.A = A
        this.B = B
        this.C = C
        this.program = program
        this.actualProgram = []
        this.pointer = 0
        this.output = []
        this.paths = []
    }

    get combo() {
        return (operand) => {
            const mapping = {
                0: 0,
                1: 1,
                2: 2,
                3: 3,
                4: this.A,
                5: this.B,
                6: this.C,
                7: null,
            };
            return mapping.hasOwnProperty(operand) ? mapping[operand] : null;
        };
    }

    adv(operand) {
        this.A = Math.trunc(this.A / Math.pow(2, this.combo(operand)))
        this.pointer += 2
    }

    bxl(operand) {
        this.B = this.B ^ operand
        this.pointer += 2
    }

    bst(operand) {
        this.B = this.combo(operand) % 8
        this.pointer += 2
    }

    jnz(operand) {
        if (this.A !== 0) this.pointer = operand
        else this.pointer += 2
    }

    bxc(operand) {
        this.B = this.B ^ this.C
        this.pointer += 2
    }

    out(operand) {
        this.output.push(this.combo(operand) % 8)
        this.pointer += 2
    }

    bdv(operand) {
        this.B = Math.trunc(this.A / Math.pow(2, this.combo(operand)))
        this.pointer += 2
    }

    cdv(operand) {
        this.C = Math.trunc(this.A / Math.pow(2, this.combo(operand)))
        this.pointer += 2
    }

    next() {
        const [opcode, operand] = this.program.slice(this.pointer, this.pointer + 2)
        switch (opcode) {
            case 0:
                this.adv(operand)
                break;
            case 1:
                this.bxl(operand)
                break;
            case 2:
                this.bst(operand)
                break;
            case 3:
                this.jnz(operand)
                break;
            case 4:
                this.bxc(operand)
                break;
            case 5:
                this.out(operand)
                break;
            case 6:
                this.bdv(operand)
                break;
            case 7:
                this.cdv(operand)
                break;
            default:
                console.error(`Wrong opcode ${opcode}!\noperand: ${operand}\nA: ${this.A}\nB: ${this.B}\nC: ${this.C}\npointer: ${this.pointer}\nprogram: ${this.program})`)
                return false
        }
        this.actualProgram.push(opcode, operand)
        return this.program.length > this.pointer
    }

    execute() {
        while (this.next()) { }
        // console.log(this.actualProgram)
        return this.output.join(',')
    }

    findPaths(pointer = 0, visited = new Map(), currentPath = [], loopPath = []) {
        while (pointer < this.program.length) {
            const [opcode, operand] = this.program.slice(pointer, pointer + 2)
            const key = `${pointer}`
            if (visited.has(key)) {
                const loopStart = visited.get(key)
                const loopContent = currentPath.slice(loopStart)
                loopPath.push({ loop: loopContent })
                return
            }
            visited.set(key, currentPath.length)
            currentPath.push([opcode, operand])
            if (opcode === 3) {
                const jumpPath = [...currentPath];
                const continuePath = [...currentPath];
                const jumpVisited = new Map(visited);
                const continueVisited = new Map(visited);
                this.findPaths(operand, jumpVisited, jumpPath, loopPath);
                this.findPaths(pointer + 2, continueVisited, continuePath, loopPath);
                return
            }
            pointer += 2
        }
        this.paths.push({ path: currentPath, loops: loopPath });
    }
}

function findAllCandidatesAtStep(A_next_candidates, desiredOut) {
    const newCandidates = [];
    for (const A_next of A_next_candidates) {
        for (let R = 0n; R < 8n; R++) {
            const A_i = 8n * A_next + R
            const B = computeB(A_i)
            const outVal = B % 8n
            if (outVal === desiredOut) {
                console.log(desiredOut, A_i)
                newCandidates.push(A_i)
            }
        }
    }
    return newCandidates
}

function computeB(A) {
    const r = A % 8n
    const power = r ^ 1n
    const divFactor = 2n ** power
    const part = A / divFactor
    return ((r ^ 1n) ^ 4n) ^ part
}

function findMinimalA(program) {
    const N = program.length
    let candidates = [0n]
    for (let i = N - 1; i >= 0; i--) {
        const desiredOut = BigInt(program[i])
        console.log(i)
        candidates = findAllCandidatesAtStep(candidates, desiredOut)
    }
    let minimalA = candidates[0]
    for (const c of candidates) {
        if (c < minimalA) {
            minimalA = c
        }
    }
    return minimalA
}
