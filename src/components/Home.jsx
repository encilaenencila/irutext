import React, { useState } from "react";
import { BiImageAdd } from "react-icons/bi";
import { IoMdCopy } from "react-icons/io";
import { createWorker } from "tesseract.js";

import swal from "sweetalert";
function Home() {
  const [imgtotext, setImgToText] = useState("");
  const [log, setLog] = useState({});

  const uploadImage = async (e) => {
    if (e.target.files[0].name.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/i)) {
      const imgFile = e.target.files[0];
      const base64 = await base54Converter(imgFile);

      const worker = createWorker({
        logger: (m) => {
          setLog({
            status: m.status,
            progress: m.progress,
          });
        },
      });

      (async () => {
        await worker.load();
        await worker.loadLanguage("eng");
        await worker.initialize("eng");
        const {
          data: { text },
        } = await worker.recognize(base64);
        setImgToText(text);
        await worker.terminate();
      })();
    } else {
      swal("Oops!", "Your file is not an Image! Try again!", "error");

      setImgToText("");
    }
  };

  function passImage(id, url) {
    document.querySelectorAll(id).forEach((div) => {
      div.style.backgroundImage = `url(${url}) `;
      div.style.backgroundRepeat = `no-repeat`;
      div.style.backgroundSize = `contain`;
      div.style.backgroundPosition = `center`;
      div.style.backgroundOrigin = `content-box`;
      div.style.padding = `10px`;
    });
  }

  const base54Converter = (file) => {
    return new Promise((res, rej) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        var newImage = fileReader.result;
        passImage("#passimagehere", newImage);
        res(fileReader.result);
      };

      fileReader.onerror = (err) => {
        rej(err);
      };
    });
  };

  function copyTextHandler(text) {
    if (!text.length <= 0) {
      navigator.clipboard.writeText(text);
      swal("Success!", "Copied to Clipboard", "success");
    } else {
      swal("Oops!", "Text is empty!", "error");
    }
  }

  function getNum(val) {
    val = +val || 0;
    return val;
  }

  const novalueHAndler = () => {};

  return (
    <div
      className="w-full  min-h-screen flex flex-col justify-between bg-gradient-to-t from-[#fae2d0]
     "
    >
      <div className="w-full  grid md:grid-cols-1   text-center">
        <div
          style={{ width: `${Math.floor(getNum(log.progress) * 100)}%` }}
          className="bg-[#F1A166]  text-xs font-medium py-[1px] text-white text-center "
        >
          {`${Math.floor(getNum(log.progress) * 100)}%`}
        </div>
        <h1 className=" text-5xl md:text-5xl font-bold text-[#F1A166] mt-2">iruTex</h1>

        <h1 className="text-md text-black">image to text extractor</h1>
      </div>

      <div className="grid md:grid-cols-2 content-center">
        <div className="flex flex-col justify-center  md:items-start  w-full md:max-w-[700px] px-2 py-8 md:last m-auto">
          <label
            htmlFor="upload-photo"
            className=" flex flex-col-2  justify-center max-w-[190px] shadow-md px-3 py-3 bg-white hover:text-white  hover:bg-[#F1A166] border-solid border-2  border-[#F1A166] my-2    cursor-pointer rounded-xl"
          >
            <BiImageAdd className="text-xl mr-1" /> <p>Upload Image</p>
          </label>
          <input
            type="file"
            name="image"
            id="upload-photo"
            className="invisible  hidden "
            onChange={uploadImage}
          />
          <div
            className=" xl:w-[100%] xl:h-[400px] md:w-[100%] min-h-[400px] sm:w-[100%] sm:h-[300px] bg-[#F1A166] shadow-xl rounded-xl"
            id="passimagehere"
          ></div>
        </div>

        <div className="flex flex-col justify-center md:items-start w-full md:max-w-[700px] px-2 py-8 md:last m-auto">
          <button
            className="  flex flex-col-2 justify-center max-w-[190px] shadow-md px-3 py-3 bg-white hover:text-white  hover:bg-[#F1A166] my-2  border-solid border-2  border-[#F1A166]  rounded-xl"
            onClick={() => copyTextHandler(imgtotext)}
          >
            <IoMdCopy className="text-xl mr-1" /> <p>Copy text</p>
          </button>
          <textarea
            onChange={() => novalueHAndler}
            value={imgtotext}
            readOnly
            className=" scroll xl:w-[100%] xl:h-[400px] md:w-[100%] min-h-[400px] sm:w-[100%] sm:h-[300px]  resize-none p-2 bg-[#F1A166] shadow-xl rounded-xl  outline-0"
          />
        </div>
      </div>

      <div className="w-full bg-[]"></div>
    </div>
  );
}

export default Home;
