import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Select, { SelectOption } from "./components/Select";

function App() {
  const options = [
    { label: "First", value: 1 },
    { label: "Second", value: 2 },
    { label: "Third", value: 3 },
    { label: "Fourth", value: 4 },
    { label: "Fifth", value: 5 },
  ];

  const [selectedOption, setSelectedOption] = useState<
    SelectOption | undefined
  >(undefined);

  const [multiSelectedArr, setMultiSelectedArr] = useState<SelectOption[]>([]);

  return (
    <div className="App">
      <p>Multi Select:</p>
      <Select
        multiple
        selectedOption={multiSelectedArr}
        options={options}
        onChange={(e) => setMultiSelectedArr(e)}
      />
      <br />
      <p>Single Select:</p>
      <Select
        selectedOption={selectedOption}
        options={options}
        onChange={(e) => setSelectedOption(e)}
      />
    </div>
  );
}

export default App;
