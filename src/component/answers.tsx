import { useEffect, useState } from 'react';

const Answers = ({ ans, index, totalResult, type }) => {
  const [heading, setHeading] = useState(false);

  function checkHeading(str) {
    return /:$/.test(str);
  }

  function replaceEndingColonWithEmoji(str) {
    return str.replace(/:$/, '🚀');
  }

  function replaceEndingColon(str) {
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
