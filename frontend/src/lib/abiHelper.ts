function getContractAbiAndArgs(chainId, contractType, functionName, additionalArgs = []) {
  let abi
  let args

  switch (chainId) {
    case 5: // Goerli
      switch (contractType) {
        case 'dai':
          abi = daiGoerliAbi
          switch (functionName) {
            case 'approve':
              args = [fundPGVaultAddress, approvalVal === '' ? 0 : approvalVal, ...additionalArgs]
              break
            // other cases for methods specific to the Goerli network
          }
          break
        case 'fundPg':
          abi = fundPgGoerliAbi
          switch (functionName) {
            case 'depositUnderlyingOnBehalf':
              args = [depositVal === '' ? 0 : debouncedDeposit, allocationVal === '' ? 0 : debouncedAllocation, ...additionalArgs]
              break
            // other cases for methods specific to the Goerli network
          }
          break
      }
      break
    case 137: // Polygon
      switch (contractType) {
        case 'dai':
          abi = daiPolygonAbi
          switch (functionName) {
            case 'approve':
              args = [fundPGVaultAddress, approvalVal === '' ? 0 : approvalVal, ...additionalArgs]
              break
            // other cases for methods specific to the Polygon network
          }
          break
        case 'fundPg':
          abi = fundPgPolygonAbi
          switch (functionName) {
            case 'depositUnderlyingOnBehalf':
              args = [depositVal === '' ? 0 : debouncedDeposit, allocationVal === '' ? 0 : debouncedAllocation, ...additionalArgs]
              break
            // other cases for methods specific to the Polygon network
          }
          break
      }
      break
    case 80001: // Mumbai
      switch (contractType) {
        case 'dai':
          abi = daiMumbaiAbi
          switch (functionName) {
            case 'approve':
              args = [fundPGVaultAddress, approvalVal === '' ? 0 : approvalVal, ...additionalArgs]
              break
            // other cases for methods specific to the Mumbai network
          }
          break
        case 'fundPg':
          abi = fundPgMumbaiAbi
          switch (functionName) {
            case 'depositUnderlyingOnBehalf':
              args = [depositVal === '' ? 0 : debouncedDeposit, allocationVal === '' ? 0 : debouncedAllocation, ...additionalArgs]
              break
            // other cases for methods specific to the Mumbai network
          }
          break
      }
      break
    case 420: // Optimistic Goerli
      switch (contractType) {
        case 'dai':
          abi = daiOptimismGoerliAbi
          switch (functionName) {
            case 'approve':
              args = [fundPGVaultAddress, approvalVal === '' ? 0 : approvalVal, ...additionalArgs]
              break
            // other cases for methods specific to the Optimistic Goerli network
          }
          break
        case 'fundPg':
          abi = fundPgOptimismGoerliAbi
          switch (functionName) {
            case 'depositUnderlyingOnBehalf':
              args = [depositVal === '' ? 0 : debouncedDeposit, allocationVal === '' ? 0 : debouncedAllocation, ...additionalArgs]
              break
            // other cases
            // other cases for methods specific to the Optimistic Goerli network
          }
          break
      }
      break
  }

  return { abi, args }
}