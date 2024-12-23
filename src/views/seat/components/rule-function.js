
export function leftToRight(areaSeatList) {
  areaSeatList = areaSeatList.sort((a, b) => {
    const aNum = Number(a.rowIndex) * 100 + Number(a.colIndex)
    const bNum = Number(b.rowIndex) * 100 + Number(b.colIndex)
    return aNum - bNum
  })
  return areaSeatList
}

export function rightToLeft(areaSeatList) {
  areaSeatList = areaSeatList.sort((a, b) => {
    const aNum = Number(a.colIndex) - Number(a.rowIndex) * 100
    const bNum = Number(b.colIndex) - Number(b.rowIndex) * 100
    return bNum - aNum
  })
  return areaSeatList
}

export function leftToRightForS(areaSeatList, length) {
  areaSeatList = areaSeatList.sort((a, b) => {
    let aNum = Number(a.rowIndex) * 100 + Number(a.colIndex)

    if (a.rowIndex % 2 == 0) {
      aNum = Number(a.rowIndex) * 100 + Number(length - a.colIndex)
    }
    let bNum = Number(b.rowIndex) * 100 + Number(b.colIndex)
    if (b.rowIndex % 2 == 0) {
      bNum = Number(b.rowIndex) * 100 + Number(length - b.colIndex)
    }
    return aNum - bNum
  })
  return areaSeatList
}

export function rightToLeftForS(areaSeatList, length) {
  areaSeatList = areaSeatList.sort((a, b) => {
    let aNum = Number(a.colIndex) - Number(a.rowIndex) * 100

    if (a.rowIndex % 2 == 0) {
      aNum = Number(length - a.colIndex) - Number(a.rowIndex) * 100
    }
    let bNum = Number(b.colIndex) - Number(b.rowIndex) * 100
    if (b.rowIndex % 2 == 0) {
      bNum = Number(length - b.colIndex) - Number(b.rowIndex) * 100
    }
    return bNum - aNum
  })
  return areaSeatList
}
function getSortSeat(areaSeatList, num, first) {
  let seats = areaSeatList.filter(seat => seat.rowIndex == num)
  seats = seats.sort((a, b) => a.colIndex - b.colIndex)
  seats.forEach((seat, index) => {
    seat.seatSortIndex = index
  })
  const centerSortIndex = seats.findIndex(seat => seat.seatType == 4)
  seats = seats.sort((a, b) => {
    const disA = a.seatSortIndex - centerSortIndex
    const disB = b.seatSortIndex - centerSortIndex
    const absDisA = Math.abs(disA)
    const absDisB = Math.abs(disB)
    if (absDisA == absDisB) {
      if (first == 'left') {
        return disA - disB
      } else {
        return disB - disA
      }
    } else {
      return absDisA - absDisB
    }
  })
  return seats
}
export function centerToLeftToRight(areaSeatList) {
  const rowNumberSet = new Set(areaSeatList.map((seat) => seat.rowIndex))
  let rowNumber = Array.from(rowNumberSet)
  rowNumber = rowNumber.sort((a, b) => a - b)
  let result = []
  rowNumber.forEach(num => {
    result = result.concat(getSortSeat(areaSeatList, num, 'left'))
  })
  console.log(result)
  return result
}

export function centerToRightToLeft(areaSeatList) {
  const rowNumberSet = new Set(areaSeatList.map((seat) => seat.rowIndex))
  let rowNumber = Array.from(rowNumberSet)
  rowNumber = rowNumber.sort((a, b) => a - b)
  let result = []
  rowNumber.forEach(num => {
    result = result.concat(getSortSeat(areaSeatList, num, 'right'))
  })
  return result
}
