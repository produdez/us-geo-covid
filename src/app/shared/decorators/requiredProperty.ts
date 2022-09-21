import { Component, Input, OnInit } from '@angular/core';

export function RequiredProperty(target: any, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    get() {
      throw new Error(`Attribute ${propertyKey} is required`)
    },
    set(value) {
      Object.defineProperty(this, propertyKey, {
        value,
        writable: true,
        configurable: false,
      })
    },
    configurable: true
  })
}

// NOTE: use like so @Input() @Required a: number;
// Ref: https://stackoverflow.com/questions/35528395/make-directive-input-required
// Final answer: https://stackoverflow.com/a/68576381 (using this)
