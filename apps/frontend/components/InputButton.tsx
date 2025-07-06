interface InputButtonProps{
    buttonText: string, 
    onSubmit: () => void
}
const InputButton = ({buttonText, onSubmit}: InputButtonProps) => {
  return (
    <button type="button" onClick={onSubmit} className="cursor-pointer w-full bg-[hsl(var(--input-button))] p-3 rounded text-white">{buttonText}</button>
  )
}

export default InputButton