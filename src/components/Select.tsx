import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/select.module.css";

export type SelectOption = {
  label: string;
  value: string | number;
};

type MultipleSelectProps = {
  multiple: true;
  selectedOption: SelectOption[];
  onChange: (value: SelectOption[]) => void;
};

type SingleSelectProps = {
  multiple?: false;
  selectedOption?: SelectOption;
  onChange: (value: SelectOption | undefined) => void;
};

type SelectProps = {
  options: SelectOption[];
} & (SingleSelectProps | MultipleSelectProps);

export default function Select({
  multiple,
  selectedOption,
  options,
  onChange,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  let [updatedOptions, setUpdatedOptions] = useState<[] | SelectOption[]>(
    options
  );

  const clearOptions = () => {
    multiple ? onChange([]) : onChange(undefined);
  };

  function selectOption(option: SelectOption) {
    if (multiple) {
      if (selectedOption.some((x) => x.value == option.value)) {
        onChange(selectedOption.filter((o) => o.value !== option.value));
      } else {
        onChange([...selectedOption, option]);
      }
    } else {
      if (option.value !== selectedOption?.value) onChange(option);
    }
  }

  function isOptionSelected(option: SelectOption) {
    // console.log(option == value, "Value:", value);
    // console.log(multiple ? selectedOption.includes(option) : selectedOption);

    return multiple
      ? selectedOption.some((x) => x.value == option.value)
      : option.value === selectedOption?.value;
  }
  //   console.log(selectedOption);

  useEffect(() => {
    if (isOpen) setHighlightedIndex(0);
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target != containerRef.current) return;
      switch (e.code) {
        case "Enter":
        case "Space":
          setIsOpen((prev) => !prev);
          if (isOpen) selectOption(updatedOptions[highlightedIndex]);
          break;
        case "ArrowUp":
        case "ArrowDown": {
          if (!isOpen) {
            setIsOpen(true);
            break;
          }

          const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
          if (newValue >= 0 && newValue < updatedOptions.length) {
            setHighlightedIndex(newValue);
          }
          break;
        }
        case "Escape":
          setIsOpen(false);
          break;
      }
    };
    containerRef.current?.addEventListener("keydown", handler);

    return () => {
      containerRef.current?.removeEventListener("keydown", handler);
    };
  }, [isOpen, highlightedIndex, options]);

  useEffect(() => {
    setUpdatedOptions(
      options.filter((option) =>
        multiple
          ? !selectedOption.some((x) => x.value == option.value)
          : option.value != selectedOption?.value
      )
    );
  }, [selectedOption]);

  return (
    <div
      ref={containerRef}
      onBlur={() => setIsOpen(false)}
      onClick={() => setIsOpen((prev) => !prev)}
      tabIndex={0}
      className={styles.container}
    >
      <span className={styles.value}>
        {multiple
          ? selectedOption.length > 0
            ? selectedOption.map((item) => {
                return (
                  <button
                    key={item.value}
                    className={styles.option_badge}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectOption(item);
                    }}
                  >
                    {item.label}
                    <span className={styles["remove-btn"]}> &times;</span>
                  </button>
                );
              })
            : "Select an option"
          : selectedOption?.label ?? "Select an option"}
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          clearOptions();
        }}
        className={styles["clear-btn"]}
      >
        &times;
      </button>

      <div className={styles.divider}></div>

      <div
        className={`${styles.caret} ${
          !isOpen ? styles.caret_open : styles.caret_close
        }`}
      ></div>
      <ul className={`${styles.options} ${isOpen ? styles.show : null}`}>
        {/* {options.map((option, index) => {
          if (multiple && selectedOption.some((x) => x.value == option.value))
            return;
          else if (selectedOption?.value == option.value) return; */}
        {updatedOptions.map((option, index) => {
          return (
            <li
              key={option.value}
              //   ${  isOptionSelected(option) ? styles.selected : ""}
              className={`${styles.option} 
            ${highlightedIndex === index ? styles.highlighted : ""}`}
              onClick={(e) => {
                //   e.stopPropagation();
                selectOption(option);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {option.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
