import React, { useState, useRef } from 'react';

import Layout from 'components/Layout';
import Container from 'components/Container';
import Info from 'components/Info'

import paymongoLogo from '../assets/images/_paymongo.png'
import baseTemplate from '../assets/images/_base_new.png'

import QrCode from 'react-qrcode-svg';


const IndexPage = () => {


  const fileInput = useRef()
  const canvasRef = useRef()
  const qrImageRef = useRef()

  const [loading, setLoading] = useState(false)
  const [urlString, setUrlString] = useState('');
  const [merchantString, setMerchantString] = useState('');
  const [showUrl, setShowUrl] = useState(false)

  // Dimensions
  // Sizes
  const qrCodeDimension = 1700;
  const qrCodeLogoDimension = 300;
  const logoDimension = 300;
  const baseImageDimension = [2572, 4096];
  const middleOffset = 0;
  // Positions
  const textPosition = [baseImageDimension[0] / 2, 2450]
  const linkPosition = [baseImageDimension[0] / 2, 2550]
  const logoPosition = [baseImageDimension[0] / 2 - logoDimension / 2 + middleOffset, 2350]

  const qrPosition = [baseImageDimension[0] / 2 - qrCodeDimension / 2 + middleOffset, 700]
  const qrLogoPosition = [baseImageDimension[0] / 2 - qrCodeLogoDimension / 2 + middleOffset, 1350]


  // QR has https
  // Link String has no https
  // Checkbox 
  // Include Additional Info 

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!loading) {
      setLoading(true)
      const ctx = canvasRef.current.getContext('2d')
      // Clear canvas
      ctx.clearRect(0, 0, baseImageDimension[0], baseImageDimension[1]);

      // Loading baseImg
      const baseImage = new Image();
      baseImage.onload = () => {
        ctx.drawImage(baseImage, 0, 0)
        // Loading Merchant logo
        let merchantLogoImage = new Image();

        const cleanUrlString = urlString.replace('https://', '')
        let leftOffset = cleanUrlString.length * 16;
        const marginRight = 100
        let topOffset = 0
        merchantLogoImage.onload = () => {
          if (!showUrl) {
            topOffset = 40
            leftOffset = merchantString.length * 22;
          }
          ctx.drawImage(merchantLogoImage, logoPosition[0] - leftOffset - marginRight, logoPosition[1], logoDimension, logoDimension)
          // Writing Business Name
          const { text_b, x_b, y_b } = { text_b: merchantString, x_b: textPosition[0] - leftOffset + logoDimension / 2, y_b: textPosition[1] + topOffset };
          const fontSize_b = 100, fontSize_p = 80, fontFamily = 'Manrope', color = 'white', textAlign = 'left', textBaseline = 'middle';
          ctx.beginPath();
          ctx.font = '900 ' + fontSize_b + 'px ' + fontFamily;
          ctx.textAlign = textAlign;
          ctx.textBaseline = textBaseline;
          ctx.fillStyle = color;
          ctx.fillText(text_b, x_b, y_b);
          ctx.stroke();

          if (showUrl) {
            // Writing Page Link
            const { text_p, x_p, y_p } = { text_p: cleanUrlString, x_p: linkPosition[0] - leftOffset + logoDimension / 2, y_p: linkPosition[1] };
            ctx.beginPath();
            ctx.font = '600 ' + fontSize_p + 'px ' + fontFamily;
            ctx.textAlign = textAlign;
            ctx.textBaseline = textBaseline;
            ctx.fillStyle = color;
            ctx.fillText(text_p, x_p, y_p);
            ctx.stroke();
          }

          URL.revokeObjectURL(fileInput.current.files[0])
          // Adding the QR to the base image
          // get svg data
          const qrImageDataURI = qrImageRef.current.children[0]
          let xml = new XMLSerializer().serializeToString(qrImageDataURI);
          // make it base64
          let svg64 = window.btoa(xml);
          let b64Start = 'data:image/svg+xml;base64,';
          // prepend a "header"
          let image64 = b64Start + svg64;
          let qrImage = new Image();
          // set it as the source of the img element
          qrImage.onload = function () {
            // draw the image onto the canvas
            ctx.drawImage(qrImage, qrPosition[0], qrPosition[1], qrCodeDimension, qrCodeDimension);

            // Adding Paymongo Logo to qr
            let paymongoLogoImage = new Image();
            paymongoLogoImage.onload = () => {
              ctx.drawImage(paymongoLogoImage, qrLogoPosition[0], qrLogoPosition[1], qrCodeLogoDimension, qrCodeLogoDimension)
              // Download Canvas
              const image = canvasRef.current.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
              const link = document.createElement('a');
              link.download = `${merchantString}paymongo-qr.png`;
              link.href = image;
              link.click();
              setLoading(false)
            }
            paymongoLogoImage.src = paymongoLogo
          }
          qrImage.src = image64;
        }
        if (fileInput.current.files[0]) {
          merchantLogoImage.src = URL.createObjectURL(fileInput.current.files[0])
        }
        else {
          alert("Warning: No logo detected.")
        }
      }
      baseImage.src = baseTemplate
    }
  }

  return (
    <Layout pageName="home">
      <Container>
        <section className="section">
          <Info />
          <form onSubmit={onSubmit}>
            <h2>Generate your QR </h2>
            <div className="label"><p htmlFor="name" className="label__label">Business Name</p></div>
            <div style={{ fontFamily: 'Manrope' }}>.</div>
            <label className="input__wrapper" htmlFor="name">
              <input
                className="input"
                id="name"
                name="name"
                type="text"
                value={merchantString}
                placeholder="Your business name"
                onChange={e => setMerchantString(e.target.value)}
              />
            </label>
            <div className="label"><p htmlFor="name" className="label__label">Enter Page URL</p></div>
            <label className="input__wrapper" htmlFor="url">
              <input
                className="input"
                id="url"
                name="url"
                type="text"
                value={urlString}
                placeholder="https://paymongo.page/l/page-slug"
                onChange={e => setUrlString(e.target.value)}
              />
            </label>
            <div className="label"><p htmlFor="name" className="label__label">Business Logo</p></div>
            <label className="input__wrapper" htmlFor="logoFile">
              <input
                className="input"
                id="logoFile"
                name="logoFile"
                type="file"
                ref={fileInput}
              />
            </label>

            <label className="" htmlFor="showUrl">
              <div className="label"><p htmlFor="name" className="label__label">Show URL? <input
                className=""
                id="showUrl"
                checked={showUrl}
                name="showUrl"
                type="checkbox"
                onClick={e => setShowUrl(!showUrl)}
              /></p></div>

            </label>
            <button type="submit" disabled={loading}>
              {loading ? "Loading" : "Download"}
            </button>

            <div className="hidden">
              <div ref={qrImageRef}>
                <QrCode
                  data={urlString}
                  height={qrCodeDimension}
                  width={qrCodeDimension}
                  fgColor="url(#gradientFill)"
                >
                  <linearGradient id="gradientFill" x1="0" y1="0" x2="1" y2=".7">
                    <stop offset="0%" stopColor="#00a98c" />
                    <stop offset="100%" stopColor="#5c7cc9" />
                  </linearGradient>
                </QrCode>
              </div>
              <canvas ref={canvasRef} width={baseImageDimension[0]} height={baseImageDimension[1]} />
            </div>
          </form>
        </section>

      </Container>
    </Layout>
  );
};

export default IndexPage;
