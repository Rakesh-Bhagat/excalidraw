interface InputBoxProps{
    type: string, 
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void, 
    placeholder: string
}

const InputBox = ({type, handleChange, placeholder }: InputBoxProps) => {
  return (
    <input type={type} placeholder={placeholder}  onChange={handleChange} className="bg-[hsl(var(--input-background))] rounded outline-none w-full p-2.5 text-white mb-3"/>
  )
}

export default InputBox