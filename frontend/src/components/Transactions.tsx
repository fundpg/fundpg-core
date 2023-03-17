import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Transaction {
  amount: string;
  date: string;
}

interface TransactionsProps {
  contractAddress: string;
  walletAddress: string;
  chainId: string;
}

const Transactions: React.FC<TransactionsProps> = ({
  contractAddress,
  walletAddress,
  chainId,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const getAssetTransfers = async (contractAddress, walletAddress, chainId) => {
    const url = `/alchemy/`;
    const data = {
      jsonrpc: '2.0',
      id: 1,
      method: 'alchemy_getAssetTransfers',
      params: {
        from: walletAddress,
        to: contractAddress,
        contract_address: contractAddress,
        page_size: 50,
        sort: 'desc',
      },
    };

    try {
      const response = await axios.post(url, data);
      if (response.data && response.data.result) {
        console.log(response.data.result);
        return response.data.result;
      } else {
        console.error('Error fetching transactions:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  };

  useEffect(() => {
    getAssetTransfers(contractAddress, walletAddress, chainId)
      .then((fetchedTransactions) => setTransactions(fetchedTransactions))
      .catch((error) => console.error('Error fetching transactions:', error));
  }, [contractAddress, walletAddress, chainId]);

  return (
    <div className="rounded-md p-2 bg-white text-black flex flex-col">
      {transactions.map((item, index) => {
        return (
          <div key={`${item.amount} ${item.date}`} className="mb-2 last-of-type:mb-0">
            <p className="float-left inline-block">
              {item.amount.split(' ')[0]}{' '}
              <span className="text-red-500">{`${item.amount.split(' ')[1]} ${item.amount.split(' ')[2]}`}</span>
            </p>
            <p className="float-right inline-block">{item.date}</p>
            {index !== transactions.length - 1 && (
            <hr className="mt-8 mb-0 border-gray-300 w-full" />
            )}
        </div>
        );
        })}
    </div>
    );
};

export default Transactions;
