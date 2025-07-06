import React, { useEffect, useState } from 'react';

const Answers = ({ ans, key ,totalResult,type}) => {
  const [heading, setHeading] = useState(false);

  function checkHeading(str: string) {
    return /:$/.test(str);
  }

  function replaceEndingColonWithEmogie(str) {
    return str.replace(/:$/, '🚀');
  }
  function replaceEndingColon(str) {
    return str.replace(/:$/, '!');
  }

  useEffect(() => {
    if (checkHeading(ans)) return setHeading(true);
  }, [ans]);
  return (
    <div>
      {key == 0 && totalResult>1 ? (
        <span className="text-md font-light px-5">{replaceEndingColonWithEmogie(ans)}</span>
      ) : heading ? (
        <span className="text-lg font-medium text-white p-1">
          {replaceEndingColon(ans)}
        </span>
      ) : (
        <span className={`text-md font-light ${type==='q'? 'pl-2':'pl-5'}`}>{ans}</span>
      )}
    </div>
  );
};

export default Answers;
