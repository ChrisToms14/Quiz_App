import styled from 'styled-components';
import { Check, X } from 'lucide-react';

const StyledButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  text-align: left;
  color: ${props => props.$isRevealed && props.$isCorrect ? '#15803d' : props.$isRevealed && !props.$isCorrect && props.$isSelected ? '#dc2626' : '#1c1917'};
  background-color: ${props => {
    if (props.$isRevealed && props.$isCorrect) return '#dcfce7';
    if (props.$isRevealed && !props.$isCorrect && props.$isSelected) return '#fee2e2';
    if (props.$isSelected && !props.$isRevealed) return '#fef3c7';
    return '#fafaf9';
  }};
  border: 2px solid ${props => {
    if (props.$isRevealed && props.$isCorrect) return '#22c55e';
    if (props.$isRevealed && !props.$isCorrect && props.$isSelected) return '#ef4444';
    if (props.$isSelected && !props.$isRevealed) return '#eab308';
    return '#e7e5e4';
  }};
  border-radius: 0.75rem;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover:not(:disabled) {
    background-color: ${props => props.$isRevealed ? undefined : '#fef9c3'};
    border-color: ${props => props.$isRevealed ? undefined : '#facc15'};
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid #fde047;
    outline-offset: 2px;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  @media (max-width: 640px) {
    padding: 0.875rem 1.25rem;
    font-size: 0.938rem;
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${props => props.$animate ? 'fadeScale 0.3s ease' : 'none'};

  @keyframes fadeScale {
    0% {
      opacity: 0;
      transform: scale(0.5);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const AnswerButton = ({ option, isSelected, isCorrect, isRevealed, onClick, disabled }) => {
  return (
    <StyledButton
      onClick={onClick}
      disabled={disabled}
      $isSelected={isSelected}
      $isCorrect={isCorrect}
      $isRevealed={isRevealed}
      aria-pressed={isSelected}
    >
      <span>{option}</span>
      {isRevealed && (
        <IconWrapper $animate={true}>
          {isCorrect ? (
            <Check size={20} strokeWidth={3} />
          ) : isSelected ? (
            <X size={20} strokeWidth={3} />
          ) : null}
        </IconWrapper>
      )}
    </StyledButton>
  );
};

export default AnswerButton;
