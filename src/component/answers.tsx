import { useEffect, useState } from 'react';

interface AnswersProps {
  ans: string;
  index: number;
  totalResult: number;
  type: 'q' | 'a';
}

const Answers: React.FC<AnswersProps> = ({ ans, index, totalResult, type }) => {
  const [heading, setHeading] = useState(false);

  function checkHeading(str: string): boolean {
    return /:$/.test(str);
  }

  function replaceEndingColonWithEmoji(str: string): string {
    return str.replace(/:$/, '🚀');
  }

  function replaceEndingColon(str: string): string {
    return str.replace(/:$/, '!');
  }

  useEffect(() => {
    if (checkHeading(ans)) {
      setHeading(true);
    }
  }, [ans]);

  return (
    <div>
      {index === 0 && totalResult > 1 ? (
        <span className="text-md font-light px-5">{replaceEndingColonWithEmoji(ans)}</span>
      ) : heading ? (
        <span className="text-lg font-medium text-white p-1">
          {replaceEndingColon(ans)}
        </span>
      ) : (
        <span className={`text-md font-light ${type === 'q' ? 'pl-2' : 'pl-5'}`}>
          {ans}
        </span>
      )}
    </div>
  );
};

export default Answers;
