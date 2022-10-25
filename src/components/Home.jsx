import React, { useState } from 'react'


import { createWorker } from 'tesseract.js'

import swal from 'sweetalert'
function Home() {


  const [imgtotext, setImgToText] = useState('');
  const [log, setLog] = useState({});
  
  const uploadImage = async (e) => {

    if (e.target.files[0].name.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/i)) {

      const imgFile = e.target.files[0]
      const base64 = await base54Converter(imgFile)

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
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        const { data: { text } } = await worker.recognize(base64);
        setImgToText(text)
        await worker.terminate();
      })();

    } else {
      swal("Oops!", "Your file is not an Image! Try again!", "error");

      setImgToText('')
    }


  }

  function passImage(id, url) {
    document.querySelectorAll(id).forEach(div => {
      div.style.backgroundImage = `url(${url}) `
      div.style.backgroundRepeat = `no-repeat`
      div.style.backgroundSize = `contain`
      div.style.backgroundPosition = `center`
      div.style.backgroundOrigin = `content-box`
      div.style.padding = `10px`
    });
  }



  const base54Converter = (file) => {
    return new Promise((res, rej) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file)

      fileReader.onload = () => {
        var newImage = fileReader.result
        passImage("#passimagehere", newImage)
        res(fileReader.result)
      }

      fileReader.onerror = (err) => {
        rej(err)
      }
    })
  }


  function copyTextHandler(text) {

    if (!text.length <= 0) {
      navigator.clipboard.writeText(text)
      swal("Success!", "Copied to Clipboard", "success");

    } else {
      swal("Oops!", "Text is empty!", "error");
    }

  }

  function getNum(val) {
    val = +val || 0
    return val;
  }


  const novalueHAndler = () => {
  }

  return (




    <div className='w-full  min-h-screen flex flex-col justify-between bg-[#080E2E]  '>



      <div className="w-full bg-white">

        <div style={{ width: `${Math.floor(getNum(log.progress) * 100)}%` }}
          className="bg-[#CD104D]  text-xs font-medium py-[1px] text-indigo-100 text-center "  >
          {`${Math.floor(getNum(log.progress) * 100)}%`}
        </div>

      </div>


      <div className='grid md:grid-cols-1 mx-auto '>
        
        <h1 className='py-3 text-5xl md:text-5xl font-bold text-white'>
          iruTex
        </h1>
        
        <h1 className='text-md text-[#CD104D]'>
          image to text translator
        </h1>

      </div>


      <div className='grid md:grid-cols-2  content-center'>

              <div className='flex flex-col justify-center md:items-start  w-full md:max-w-[700px] px-2 py-8 md:last m-auto' >

                <label htmlFor="upload-photo" className='px-8 py-3 bg-white hover:text-white  hover:bg-[#CD104D] border-solid border-2  border-[#CD104D] my-2 text-center  cursor-pointer '>
                  Upload Image
                </label>
                  <input type="file" name="image" id="upload-photo" className='invisible  hidden ' onChange={uploadImage} />
                    <div className=' xl:w-[100%] xl:h-[400px] md:w-[100%] min-h-[400px] sm:w-[100%] sm:h-[300px]  border-solid border  border-[#CD104D]' id='passimagehere' >
                    </div>
              </div>

              <div className='flex flex-col justify-center md:items-start w-full md:max-w-[700px] px-2 py-8 md:last m-auto' >
                <button className='px-8 py-3 bg-white hover:text-white  hover:bg-[#CD104D] my-2  border-solid border-2  border-[#CD104D]' onClick={() => copyTextHandler(imgtotext)}>
                  Copy Text
                </button>
                  <textarea onChange={() => novalueHAndler} value={imgtotext} readOnly
                    className='bg-transparent xl:w-[100%] xl:h-[400px] md:w-[100%] min-h-[400px] sm:w-[100%] sm:h-[300px]  resize-none p-2 border-solid border  border-[#CD104D] text-white' />
              </div >

      </div>

      <div className="w-full bg-white">

        <p className="w-full text-center text-[#CD104D] font-bold">irutex | 2022</p>

      </div>

    </div>


  )
}

export default Home
