export default function FileUpload({ setFile }) {
  async function handleFileUpload(event) {
    const file = await event.target.files[0].arrayBuffer();
    const fileBlob = new Blob([file], { type: event.target.files[0].type });
    setFile(fileBlob);
  }
  return (
    <section>
      <input
        id="file"
        name="file"
        type="file"
        accept=".pdf, .jpg, .jpeg, .png"
        onChange={handleFileUpload}
      />
    </section>
  );
}
