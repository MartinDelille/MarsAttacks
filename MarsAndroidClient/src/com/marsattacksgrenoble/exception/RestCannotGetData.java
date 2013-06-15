package com.marsattacksgrenoble.exception;

public class RestCannotGetData extends Exception {
	private static final long serialVersionUID = 1L;

	public RestCannotGetData() {
		super();
	}

	public RestCannotGetData(String detailMessage, Throwable throwable) {
		super(detailMessage, throwable);
	}

	public RestCannotGetData(String detailMessage) {
		super(detailMessage);
	}

	public RestCannotGetData(Throwable throwable) {
		super(throwable);
	}
}
