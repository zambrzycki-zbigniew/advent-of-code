export function solvePart1(graph, knownGroups, knownGroupsWithT) {
    if (knownGroupsWithT.length < 100) {
        console.log(exampleCorrectResult)
        console.log(knownGroupsWithT)
        console.log(knownGroups)
    }
    return knownGroupsWithT.length;
}

export function solvePart2(graph, knownGroups, knownGroupsWithT, connections) {
    const lanParties = connections.map(([pc1, pc2]) => {
        const lp = new LanParty(graph)
        lp.connect(pc1)
        lp.connect(pc2)
        return lp
    })
    for(let pc in graph) {
        lanParties.filter(lp => lp.canConnect(pc)).forEach(lp => lp.connect(pc))
    }
    // for(let pc in graph) {
    //     lanParties.filter(lp => !lp.isConnected(pc)).forEach(lp => {
    //         const subparty = lp.findOrCreateSubparty(lanParties, pc)
    //         if(subparty) subparty.connect(pc)
    //     })
    // }
    lanParties.sort((a, b) => b.size - a.size)
    console.log(lanParties.length)
    return Array.from(lanParties[0].pcs).sort().join(',');
}

const exampleCorrectResult = [
    "co,de,ta",
    "co,ka,ta",
    "de,ka,ta",
    "qp,td,wh",
    "tb,vc,wq",
    "tc,td,wh",
    "td,wh,yn",
]

class LanParty {
    constructor(graph) {
        this.pcs = new Set()
        this.graph = graph
    }

    get size() {
        return this.pcs.size
    }

    isConnected(pc) {
        return this.pcs.has(pc)
    }

    intersection(party) {
        return this.pcs.intersection(party.pcs)
    }

    connect(pc) {
        this.pcs.add(pc)
    }

    canConnect(disconnectedPc) {
        if (this.isConnected(disconnectedPc)) return false
        for (let pc of this.pcs) if (!(disconnectedPc in this.graph[pc])) return false
        return true
    }

    findOrCreateSubparty(parties, disconnectedPc) {
        if(!Array.from(this.pcs).some(pc => pc in this.graph[disconnectedPc])) return null
        // parties.forEach(party => {
        //     if(this.intersection(party).size > 0 && party.canConnect(disconnectedPc)) return party
        // })
        const lp = new LanParty(this.graph)
        Array.from(this.pcs).filter(pc => pc in this.graph[disconnectedPc]).forEach(pc => lp.connect(pc))
        parties.push(lp)
        return lp
    }
}