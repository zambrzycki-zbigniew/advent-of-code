export function parseInput(input) {
    const rows = input.split('\n')
    const pairs = rows.map(row => row.split('   ').map(str => parseInt(str)))
    const [list1, list2] = pairs.reduce(
        ([acc1, acc2], [first, second]) => {
          acc1.push(first);
          acc2.push(second);
          return [acc1, acc2];
        },
        [[], []]
      );
    return [list1, list2]
}