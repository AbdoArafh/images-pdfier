import jsPDF from "jspdf";
import { JSX, createSignal } from "solid-js";

function App() {
  const [previews, setPreviews] = createSignal<string[]>([]);
  const [files, setFiles] = createSignal<File[]>([]);
  const [outputFileName, setOutputFileName] = createSignal("filename");

  const handleFilesChange: JSX.CustomEventHandlersCamelCase<HTMLInputElement>["onChange"] =
    (event) => {
      event.preventDefault();

      if (event.target.files) {
        setFiles(Array.from(event.target.files));
        setPreviews(files().map((file) => URL.createObjectURL(file)));
      }
    };

  const convertImagesToPdf = () => {
    const imageElements = Array.from(
      document.getElementById("previews")!.children
    ).map((el) => el.children[0] as HTMLImageElement);

    if (imageElements.length === 0) return;

    const doc = new jsPDF({
      format: [imageElements[0].naturalWidth, imageElements[0].naturalHeight],
    });

    doc.deletePage(doc.getCurrentPageInfo().pageNumber);

    imageElements.forEach((image) => {
      doc.addPage([image.naturalWidth, image.naturalHeight]);
      doc.addImage(
        image.src,
        "JPEG",
        0,
        0,
        image.naturalWidth,
        image.naturalHeight
      );
    });

    doc.save(outputFileName() + ".pdf");
  };

  return (
    <div class="bg-gray-800 py-8 text-white">
      <div class="max-w-[1200px] px-4 xl:px-0 mx-auto min-h-screen">
        <div class="flex flex-col gap-4">
          <label class="flex flex-col gap-4 items-center justify-center py-14 px-8 bg-black/20 font-medium cursor-pointer hover:opacity-90 rounded-lg transition-all">
            <input
              class="hidden"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesChange}
            />
            <p>Upload images</p>
          </label>
          <input
            class="bg-transparent border border-white/20 py-2.5 px-5 rounded-lg"
            value={outputFileName()}
            onInput={(event) => setOutputFileName(event.target.value)}
          />
        </div>
        <div
          class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 py-4"
          id="previews"
        >
          {previews().map((preview) => (
            <div class="relative">
              <img class="max-w-full" src={preview} />
            </div>
          ))}
        </div>
        {!!previews().length && (
          <button
            class="flex mx-auto mt-4 py-3 px-6 bg-black/40 font-semibold rounded-lg hover:opacity-90 transition-all"
            onClick={convertImagesToPdf}
          >
            Convert to PDF
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
