import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import jsqr, { QRCode } from 'jsqr';
export type { QRCode } from 'jsqr';

export type QRReaderProps = {
  width?: number,
  height?: number,
  pause?: boolean,
  showQRFrame?: boolean,
  timerInterval?: number,
  gecognizeCallback?: (e: QRCode) => void,
}

type Point = {
  x: number;
  y: number;
}

type OverlayPosition = {
  top: number,
  left: number,
  width: number,
  height: number,
}

const RelativeWrapperDiv = styled.div<QRReaderProps>`
  position: relative;
  width : ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;

const VideoArea = styled.video`
  position: absolute; 
  z-index : -100;
`;

const OverlayDiv = styled.div<OverlayPosition>`
  position: absolute; 
  border: 1px solid #F00;
  top   : ${(props) => props.top}px;
  left  : ${(props) => props.left}px;
  width : ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;


const QRReader: React.FC<QRReaderProps> = (props) => {
  const [overlay, setOverlay] = useState({ top:0, left: 0, width: 0, height: 0 });  
  const video = useRef(null as HTMLVideoElement);
  const timerId = useRef(null);

  const drawRect = (topLeft: Point, bottomRight: Point) => {
    setOverlay({
      top: topLeft.y < bottomRight.y ? topLeft.y : bottomRight.y,
      left: topLeft.x < bottomRight.x ? topLeft.x :bottomRight.x,
      width: Math.abs(bottomRight.x - topLeft.x),
      height: Math.abs(bottomRight.y - topLeft.y),
    });
  };

  useEffect(() => {
    (async() => {
      if (props.pause) {
        video.current.pause();
        clearInterval(timerId.current);
        timerId.current = null;
        return;
      }

      const { width, height } = props;

      const constraints = { 
        audio: false, 
        video: {
          facingMode: 'environment', 
          width, 
          height, 
      }};
    
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.current.srcObject = stream;
      video.current.play();
  
      const canvas = new OffscreenCanvas(width, height);
      const context:any = canvas.getContext('2d');

      if (!timerId.current) {
        timerId.current = setInterval(() => {
          context.drawImage(video.current, 0, 0, width, height);
          const imageData = context.getImageData(0, 0, width, height);
          const qr = jsqr(imageData.data, imageData.width, imageData.height);
          if (qr) {
            //console.log(qr.data);
            //こっから下変更したよ
            if (qr.data.indexOf("焼きそば")===0){
              //console.log("客だ！！");
              const allArray = qr.data.split(";");
              //console.log(allArray);
              var nameArray:string[]=new Array( allArray.length-1 );
              var costArray:number[]=new Array( allArray.length-1 );
              var qtyArray:number[]=new Array( allArray.length-1 );
              var sumArray:number[]=new Array( allArray.length-1 );  
              for (let i = 0 ; i <allArray.length ; i++){
                let a =allArray[i].split(",");
                let name = a[0];
                let cost = Number(a[1]);
                let qty = Number(a[2]);
                let eachSum = Number(a[3]);
                nameArray[i]=name;
                costArray[i]=cost;
                qtyArray[i]=qty;
                sumArray[i]=eachSum;
              }
              // console.log("↓");
              // console.log(nameArray);
              // console.log(costArray);
              // console.log(qtyArray);
              // console.log(sumArray);
              let sum = 0;
              for(let i=0 ; i<sumArray.length-1 ; i++){
                sum =sum + sumArray[i]
              }
              //console.log(sum);//あとはsumを表示するだけ
              
            }

            if (props.showQRFrame) {
              drawRect(qr.location.topLeftCorner, qr.location.bottomRightCorner);
            }
            if (props.gecognizeCallback)
              props.gecognizeCallback(qr);
          }
        }, props.timerInterval);
      }
      return () => clearInterval(timerId.current);
    })();
  }, [props]);



  return (    
    <RelativeWrapperDiv {...props}>
      <VideoArea ref={video}></VideoArea>
      <OverlayDiv {...overlay}></OverlayDiv>
    </RelativeWrapperDiv>    
  );
}

// propsのデフォルト値を設定
QRReader.defaultProps = {
  width: 500,
  height: 500,
  pause: false,
  showQRFrame: true,
  timerInterval: 300,
};

export default QRReader;