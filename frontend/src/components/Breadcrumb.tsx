function Breadcrumb({ transactionHash, chainId, pending, success }) {
  if (!transactionHash) return null;

  const etherscanURL = (() => {
    // ... (keep the existing switch-case statement)
  })();

  return (
    <div className="fixed top-4 right-4 bg-white p-2 rounded-md shadow-md">
      <a
        href={etherscanURL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-700"
      >
        {pending ? 'View pending transaction on Etherscan' : success ? 'View successful transaction on Etherscan' : 'View transaction on Etherscan'}
      </a>
    </div>
  );
}

export default Breadcrumb;