package com.marsattacksgrenoble.exception;

public class RestCannotUpdateData extends Exception {
	private static final long serialVersionUID = 1L;

	public RestCannotUpdateData() {
		super();
	}

	public RestCannotUpdateData(String detailMessage, Throwable throwable) {
		super(detailMessage, throwable);
	}

	public RestCannotUpdateData(String detailMessage) {
		super(detailMessage);
	}

	public RestCannotUpdateData(Throwable throwable) {
		super(throwable);
	}
}
