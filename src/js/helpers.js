import { async } from 'regenerator-runtime';
import { TIME_OUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} seconds`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const responsee = await Promise.race([fetchPro, timeout(TIME_OUT_SEC)]);
    // console.log(responsee);
    const data = await responsee.json();
    console.log(data);
    if (!responsee.ok) throw new Error(`${data.message} (${responsee.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

/*
export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    const responsee = await Promise.race([fetchPro, timeout(TIME_OUT_SEC)]);
    // console.log(responsee);
    const data = await responsee.json();
    if (!responsee.ok) throw new Error(`${data.message} (${responsee.status})`);
    return data;
  } catch (err) {
     
    // an async function return always a fullfilled promise
    // So to handle with error we have to rethrow the error
    // So here the reject error related to this asyn function 
    // will be sent to thz bloc catch of the function loadRecipe
    // in model.js module
    
    throw err;
  }
};


export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    const responsee = await Promise.race([fetchPro, timeout(TIME_OUT_SEC)]);
    // console.log(responsee);
    const data = await responsee.json();
    if (!responsee.ok) throw new Error(`${data.message} (${responsee.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};  */
