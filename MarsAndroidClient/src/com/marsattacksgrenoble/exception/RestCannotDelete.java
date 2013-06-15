package com.marsattacksgrenoble.exception;

public class RestCannotDelete extends Exception {
	private static final long serialVersionUID = 1L;

	public RestCannotDelete() {
		super();
	}

	public RestCannotDelete(String detailMessage, Throwable throwable) {
		super(detailMessage, throwable);
	}

	public RestCannotDelete(String detailMessage) {
		super(detailMessage);
	}

	public RestCannotDelete(Throwable throwable) {
		super(throwable);
	}
}
