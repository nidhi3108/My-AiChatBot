import { useEffect, useRef, useState } from 'react';
import './App.css';
import { url } from './constant';
import Answers from './component/answers';
import { Trash } from 'lucide-react';
import AnimationLoader from './component/AnimationLoader';

function App() {
  const [ques, setQues] = useState('');
  type ResultItem = { type: string; text: string | string[] };
  const [result, setResult] = useState<ResultItem[]>([]);
  const [recentHitstory, setRecentHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState('');
  const [loading, setLoading] = useState(false);

  const storedHistory = localStorage.getItem('history');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const history = storedHistory ? JSON.parse(storedHistory) : [];
    setRecentHistory(history);
  }, [storedHistory]);

  // const askQues = async () => {
  //   if (!ques && !selectedHistory) return;
  //   console.log(ques, 'selectedHistory', selectedHistory);
  //   const payload = {
  //     contents: [
  //       {
  //         parts: [
  //           {
  //             text: ques ? ques : selectedHistory,
  //           },
  //         ],
  //       },
  //     ],
  //   };
  //   console.log('payload', payload);

  //   const prevHistory = localStorage.getItem('history');

  //   const prevHistoryArr: string[] = prevHistory ? JSON.parse(prevHistory) : [];
  //   if (ques) {
  //     if (prevHistoryArr.length > 0) {
  //       localStorage.setItem(
  //         'history',
  //         JSON.stringify([...prevHistoryArr, ques])
  //       );
  //     } else {
  //       localStorage.setItem('history', JSON.stringify([ques]));
  //       setRecentHistory([ques]);
  //     }
  //   }
  //   if (payload?.contents[0].parts[0].text === '') return;
  //   const response = await fetch(url, {
  //     method: 'POST',
  //     body: JSON.stringify(payload),
  //     headers: {
  //       'content-type': 'application/json',
  //     },
  //   });

  //   const data = await response.json();

  //   const dataString = data?.candidates[0].content.parts[0].text.split('*');

  //   const cleanData = dataString
  //     .map((ele) => ele.trim())
  //     .filter((ele) => ele !== '');

  //   setResult([
  //     ...result,
  //     { type: 'q', text: ques ? ques : selectedHistory },
  //     { type: 'a', text: cleanData },
  //   ]);
  //   setQues('');
  //   setSelectedHistory('');

  //   setTimeout(() => {
  //     if (scrollRef.current) {
  //       scrollRef.current.scrollTo({
  //         top: scrollRef.current.scrollHeight,
  //         behavior: 'smooth',
  //       });
  //     }
  //   }, 100);
  // };

  // useEffect(() => {
  //   if (selectedHistory) {
  //     setQues(selectedHistory);
  //     askQues();
  //   }
  // }, [selectedHistory]);
  const askQues = async () => {
    if (!ques && !selectedHistory) return;

    const questionText = ques ? ques : selectedHistory;

    // ✅ Immediately show question
    setResult((prev) => [...prev, { type: 'q', text: questionText }]);

    // ✅ Show loader
    setLoading(true);

    // Handle history as before...
    const prevHistory = localStorage.getItem('history');
    const prevHistoryArr: string[] = prevHistory ? JSON.parse(prevHistory) : [];
    if (ques) {
      const newHistory = [...prevHistoryArr, ques];
      localStorage.setItem('history', JSON.stringify(newHistory));
      setRecentHistory(newHistory);
    }

    // Do API call
    const payload = {
      contents: [
        {
          parts: [{ text: questionText }],
        },
      ],
    };
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'content-type': 'application/json' },
    });
    const data = await response.json();
    const dataString = data?.candidates[0].content.parts[0].text.split('*');
    const cleanData = dataString
      .map((ele) => ele.trim())
      .filter((ele) => ele !== '');

    // ✅ Remove loader and add answer
    setResult((prev) => [...prev, { type: 'a', text: cleanData }]);
    setLoading(false);
    setQues('');
    setSelectedHistory('');
  };

  const clearHistory = () => {
    localStorage.removeItem('history');
    setRecentHistory([]);
  };

  const isEnterPressed = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      askQues();
    }
  };
  const handleHistoryClick = (history: string) => {
    console.log(history);
    setSelectedHistory(history);
    setQues(history);
    askQues();
  };

  return (
    <>
      <div className="grid grid-cols-5 h-screen text-center">
        <div
          className="col-span-1 bg-zinc-700 h-screen overflow-scroll
        "
        >
          <div className="flex justify-center items-center bg-zinc-800">
            <header className="text-white p-6 text-2xl">Recent Search</header>{' '}
            <Trash className="w-6 h-6 text-red-500" onClick={clearHistory} />
          </div>
          <ul className="list-decimal text-white px-9 py-2">
            {Array.isArray(recentHitstory) &&
              recentHitstory.length > 0 &&
              recentHitstory.map((history: string, ind: number) => (
                <li
                  key={ind + Math.random()}
                  className="text-left px-2 py-1 "
                  onClick={() => handleHistoryClick(history)}
                >
                  {history}
                </li>
              ))}
          </ul>
        </div>
        <div className="col-span-4 bg-zinc-800 flex flex-col justify-cnter items-center gap-6 h-screen">
          <header className="text-2xl p-6 bg-gradient-to-l from-blue-600 via-green-500 to-indigo-400 bg-clip-text  text-transparent font-medium">
            Ask anything form me
          </header>
          {result && result.length > 0 ? (
            <div
              className="container h-2/3  text-white overflow-scroll px-32"
              ref={scrollRef}
            >
              {/* <ul>
                {result &&
                  result.length > 0 &&
                  result.map((ele, index) => (
                    <div
                      className={ele?.type === 'q' ? 'flex justify-end' : ''}
                      key={index + Math.random()}
                    >
                      {ele?.type === 'q' ? (
                        <li
                          key={index + Math.random()}
                          className="text-right border border-zinc-700 px-3 py-2 bg-zinc-700  w-fit rounded-br-4xl rounded-bl-4xl rounded-tl-4xl"
                        >
                          <Answers
                            key={index}
                            ans={ele?.text}
                            totalResult={1}
                            type={ele?.type}
                          />
                        </li>
                      ) : (
                        ele?.text?.map((textAns, textInd) => (
                          <li
                            key={textInd + Math.random()}
                            className="text-left p-3 "
                          >
                            <Answers
                              key={textInd}
                              ans={textAns}
                              totalResult={ele?.length}
                              type={ele?.type}
                            />
                          </li>
                        ))
                      )}
                    </div>
                  ))}
              </ul> */}
              <ul>
                {result.map((ele, index) => (
                  <div
                    className={ele?.type === 'q' ? 'flex justify-end' : ''}
                    key={index}
                  >
                    {ele?.type === 'q' ? (
                      <li className="text-right ...">
                        <Answers
                          ans={ele?.text}
                          totalResult={1}
                          type={ele?.type}
                        />
                      </li>
                    ) : (
                      ele?.text.map((textAns, textInd) => (
                        <li key={textInd} className="text-left p-3">
                          <Answers
                            ans={textAns}
                            totalResult={ele?.length}
                            type={ele?.type}
                          />
                        </li>
                      ))
                    )}
                  </div>
                ))}

                {/* ✅ Loader when waiting for answer */}
                {loading && (
                  <div className=" p-3 flex justify-start items-center">
                 <AnimationLoader/>
                  </div>
                )}
              </ul>
            </div>
          ) : (
            <div className="container h-2/3  text-white text-3xl   px-32 flex justify-center items-center">
              <span className="bg-gradient-to-l from-blue-600 via-green-500 to-indigo-400 bg-clip-text  text-transparent font-medium">
                Hello, User
              </span>
            </div>
          )}

          <div className="bg-zinc-600 rounded-4xl border-2 gap-3 border-amber-50 w-1/2 text-white flex justify-center items-center">
            <input
              placeholder="Ask Question"
              value={selectedHistory ? '' : ques}
              className="w-full h-full p-3 outline-none"
              onChange={(e) => setQues(e.target.value)}
              onKeyDown={(e) => isEnterPressed(e)}
            />
            <button
              className="px-6 bg-zinc-500 rounded-4xl py-2"
              onClick={askQues}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
