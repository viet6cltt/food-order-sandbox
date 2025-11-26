type Props = {
    className?: string
    checked: boolean
    onChange: (checked: boolean) => void
}

const CheckboxButton: React.FC<Props> = ({ className = '', checked, onChange }) => {
    return (
        <button
            type="button"
            aria-pressed={checked}
            onClick={() => onChange(!checked)}
            className={`${className} w-2 h-2 inline-flex items-center justify-center cursor-pointer rounded-full p-2 border ${checked ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-gray-300'}`}
        >
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="sr-only"
                aria-hidden
            />
            <span className={`p-1 rounded-full ${checked ? 'bg-white' : 'bg-transparent'}`} />
        </button>
    )
}

export default CheckboxButton;