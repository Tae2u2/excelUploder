import React, {
  ElementType,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Transition } from "@headlessui/react";

interface DropdownContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleOpen: () => void;
}

const DropDownContext = createContext<DropdownContextType | undefined>(
  undefined
);

interface DropdownProps {
  children?: ReactNode;
  as?: ElementType;
  className?: string;
}

const Dropdown = ({
  as: Component = "div",
  children,
  className,
}: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = useCallback(() => {
    setOpen((previousState) => !previousState);
  }, []); // Empty dependency array

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        if (open && toggleOpen) {
          toggleOpen();
        }
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [open, toggleOpen]); // Include toggleOpen as a dependency

  return (
    <DropDownContext.Provider value={{ open, setOpen, toggleOpen }}>
      <Component ref={dropdownRef} className={`dropdown ${className}`}>
        {children}
      </Component>
    </DropDownContext.Provider>
  );
};

interface TriggerProps {
  children: ReactNode;
  type?: ElementType;
  className?: string;
  id?: string;
  href?: any;
}

export const Trigger: React.FC<TriggerProps> = ({
  type,
  children,
  className,
  id,
}) => {
  const { open, toggleOpen } = useContext(DropDownContext)!;

  const getClassNameButton = className
    ? className
    : "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";
  const getClassNameLink = className
    ? className
    : "transition-all duration-200 ease-linear bg-white border-dashed dropdown-toggle text-blue-500 btn border-blue-500 hover:text-blue-500 hover:bg-blue-50 hover:border-blue-600 focus:text-blue-600 focus:bg-blue-50 focus:border-blue-600 active:text-blue-600 active:bg-blue-50 active:border-blue-600 dark:focus:ring-blue-400/20 dark:bg-blue-400/20 ";
  return (
    <button id={id} onClick={toggleOpen} className={getClassNameButton}>
      {children}
    </button>
  );
};

interface ContentProps {
  as?: ElementType;
  align?: "left" | "right";
  className?: string;
  width?: string;
  contentClasses?: string;
  children: ReactNode;
  placement?:
    | "right-end"
    | "start-end"
    | "top-end"
    | "bottom-start"
    | "bottom-end"
    | "top-start";
}

const Content: React.FC<ContentProps> = ({
  as: Component = "div",
  className,
  children,
  placement,
}) => {
  const { open, setOpen } = useContext(DropDownContext)!;

  const getClassName =
    className ||
    "absolute z-50 py-2 mt-1 text-left list-none bg-white rounded-md shadow-md dropdown-menu min-w-max dark:bg-zinc-400";

  const [placementState, setPlacement] = useState(
    "right-end" as
      | "right-end"
      | "start-end"
      | "top-end"
      | "bottom-start"
      | "bottom-end"
      | "top-start"
  );

  useEffect(() => {
    if (placement) setPlacement(placement);
  }, [placement]); // Add dependency array to useEffect

  const dropdownElementRef = useRef<HTMLDivElement>(null);

  const isRtl = document.getElementsByTagName("html")[0].getAttribute("dir");

  const getDropdownStyle = () => {
    if (open && placementState === "right-end" && dropdownElementRef.current) {
      const dropdownElement = dropdownElementRef.current;
      dropdownElement.style.position = "absolute";
      isRtl === "rtl"
        ? (dropdownElement.style.inset = "0px auto auto 0px")
        : (dropdownElement.style.inset = "0px 0px auto auto");
      dropdownElement.style.margin = "0px";
      dropdownElement.style.transform = "translate(0px, 54px)";
    }
    if (open && placementState === "start-end" && dropdownElementRef.current) {
      const dropdownElement = dropdownElementRef.current;
      dropdownElement.style.position = "absolute";
      dropdownElement.style.inset = "0px auto auto 0px";
      dropdownElement.style.margin = "0px";
      dropdownElement.style.transform = "translate(0px, 20px)";
    }
    if (open && placementState === "top-end" && dropdownElementRef.current) {
      const dropdownElement = dropdownElementRef.current;
      dropdownElement.style.position = "absolute";
      dropdownElement.style.inset = "auto 0px 0px auto";
      dropdownElement.style.margin = "0px";
      dropdownElement.style.transform = "translate(-58px, -30px)";
    }
    if (
      open &&
      placementState === "bottom-start" &&
      dropdownElementRef.current
    ) {
      const dropdownElement = dropdownElementRef.current;
      dropdownElement.style.position = "absolute";
      dropdownElement.style.inset = "0px 0px auto auto";
      dropdownElement.style.margin = "0px";
      dropdownElement.style.transform = "translate(0px, 54px)";
    }
    if (open && placementState === "bottom-end" && dropdownElementRef.current) {
      const dropdownElement = dropdownElementRef.current;
      dropdownElement.style.position = "absolute";
      dropdownElement.style.inset = "0px 0px auto auto";
      dropdownElement.style.margin = "0px";
      dropdownElement.style.transform = "translate(0px, 39px)";
    }
    if (open && placementState === "top-start" && dropdownElementRef.current) {
      const dropdownElement = dropdownElementRef.current;
      dropdownElement.style.position = "absolute";
      dropdownElement.style.inset = "auto auto 0px 0px";
      dropdownElement.style.margin = "0px";
      dropdownElement.style.transform = "translate(0px, -95px)";
    }
    return {};
  };

  return (
    <Transition as={React.Fragment} show={open}>
      {(status: any) => (
        <Component
          ref={dropdownElementRef}
          onClick={() => setOpen(false)}
          className={`${getClassName} ${status === "entered" ? "transition-all" : ""}`}
          style={getDropdownStyle()}
        >
          {children}
        </Component>
      )}
    </Transition>
  );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;

export { Dropdown };
