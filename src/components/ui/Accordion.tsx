import { ReactNode, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItemProps {
  title: string | ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  icon?: ReactNode;
  onToggle?: (isOpen: boolean) => void;
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
  disabled = false,
  className = '',
  titleClassName = '',
  contentClassName = '',
  icon,
  onToggle,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = () => {
    if (!disabled) {
      const newState = !isOpen;
      setIsOpen(newState);
      onToggle?.(newState);
    }
  };

  return (
    <div className={`border-b border-neutral-200 ${className}`}>
      <button
        type="button"
        className={`
          flex w-full items-center justify-between py-4 text-left text-base font-medium
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          ${isOpen ? 'text-primary-600' : 'text-neutral-700 hover:text-primary-500'}
          ${titleClassName}
        `}
        onClick={handleToggle}
        disabled={disabled}
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
          {icon && <span className="mr-3">{icon}</span>}
          {typeof title === 'string' ? <span>{title}</span> : title}
        </div>
        <ChevronDown
          className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180 transform' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96' : 'max-h-0'}`}
        aria-hidden={!isOpen}
      >
        <div className={`pb-4 pt-2 ${contentClassName}`}>{children}</div>
      </div>
    </div>
  );
}

interface AccordionProps {
  children: ReactNode;
  className?: string;
  allowMultiple?: boolean;
}

export function Accordion({ children, className = '', allowMultiple = false }: AccordionProps) {
  return (
    <div className={`divide-y divide-neutral-200 ${className}`} role="region">
      {children}
    </div>
  );
}

// Controlled version of Accordion that manages state externally
interface ControlledAccordionItemProps extends Omit<AccordionItemProps, 'defaultOpen'> {
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
}

export function ControlledAccordionItem({
  isOpen,
  onToggle,
  ...props
}: ControlledAccordionItemProps) {
  const handleToggle = () => {
    if (!props.disabled) {
      onToggle(!isOpen);
    }
  };

  return (
    <div className={`border-b border-neutral-200 ${props.className || ''}`}>
      <button
        type="button"
        className={`
          flex w-full items-center justify-between py-4 text-left text-base font-medium
          ${props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          ${isOpen ? 'text-primary-600' : 'text-neutral-700 hover:text-primary-500'}
          ${props.titleClassName || ''}
        `}
        onClick={handleToggle}
        disabled={props.disabled}
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
          {props.icon && <span className="mr-3">{props.icon}</span>}
          {typeof props.title === 'string' ? <span>{props.title}</span> : props.title}
        </div>
        <ChevronDown
          className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180 transform' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96' : 'max-h-0'}`}
        aria-hidden={!isOpen}
      >
        <div className={`pb-4 pt-2 ${props.contentClassName || ''}`}>{props.children}</div>
      </div>
    </div>
  );
}

// FAQ Accordion - specialized version for FAQ sections
interface FAQItemProps {
  question: string;
  answer: string | ReactNode;
  defaultOpen?: boolean;
}

export function FAQAccordion({ items, className = '' }: { items: FAQItemProps[]; className?: string }) {
  return (
    <div className={`divide-y divide-neutral-200 rounded-lg border border-neutral-200 ${className}`}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={
            <span className="font-medium text-neutral-900">{item.question}</span>
          }
          defaultOpen={item.defaultOpen}
          className="px-4"
        >
          <div className="prose prose-sm max-w-none text-neutral-600">
            {typeof item.answer === 'string' ? <p>{item.answer}</p> : item.answer}
          </div>
        </AccordionItem>
      ))}
    </div>
  );
}