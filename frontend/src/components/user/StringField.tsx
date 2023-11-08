function StringField(props: {
  placeholder: string;
  value: string;
  onChange: Function;
}) {
  return (
    <input
      type="text"
      placeholder={props.placeholder}
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
    />
  );
}

export default StringField;
