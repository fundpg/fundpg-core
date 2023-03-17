import React from 'react';
import NetworkSelection from './NetworkSelection';
interface ActionsProps {
  focused: string;
  setFocused: (value: string) => void;
  renderActionDiv: () => JSX.Element;
}

const Actions: React.FC<ActionsProps> = ({ focused, setFocused, renderActionDiv }) => {
  return (
    <div className="w-2/3 bg-[#D9D9D9] rounded-lg p-3 h-48 inline-flex flex-col justify-between">
      <div className="inline-flex">
        <NetworkSelection />
        <div className="flex justify-between rounded-lg bg-[#989898] pt-.5 pb-.5 inline-flex h-full w-full">
          <button
            className={`px-2 py-1 rounded-md l-0 ${focused === 'Approve' && 'bg-[#7A7A7A]'} text-black font-medium text-sm h-full`}
            onClick={() => focused !== 'Approve' && setFocused('Approve')}>
            Approve
          </button>
          <button
            className={`px-2 py-1 rounded-md ${focused === 'Deposit' && 'bg-[#7A7A7A]'} text-black font-medium text-sm h-full`}
            onClick={() => focused !== 'Deposit' && setFocused('Deposit')}>
            Deposit
          </button>
          <button
            className={`px-2 py-1 rounded-md r-0 ${focused === 'Withdraw' && 'bg-[#7A7A7A]'} text-black font-medium text-sm h-full`}
            onClick={() => focused !== 'Withdraw' && setFocused('Withdraw')}>
            Withdraw
          </button>
        </div>
      </div>
      {renderActionDiv()}
    </div>
  );
};

export default Actions;