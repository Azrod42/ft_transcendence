'use client'
import React, { useEffect, useState } from 'react'
import Api from '../api/api';
import { useMutation } from 'react-query';
import { createContext } from 'vm';
import { islog } from '../auth/auth.api';


interface CheckLoginProps {

}

export let userData2 = createContext();


export  function isUserLog() {
	Api.init();
	let data = islog();
	return data;
}

export function isPromise(p: any) {
	return p && Object.prototype.toString.call(p) === "[object Promise]";
  }
