import { CustomError } from 'ts-custom-error';
import { httpErrorMessages, HttpErrorCode, HttpErrorMessage } from './HttpErrorMessages';

export class HttpError<
    TCode extends HttpErrorCode,
    TMessage extends HttpErrorMessage<TCode>,
> extends CustomError {
    code: TCode;
    private _message: TMessage;
    private _customMessage?: string;

    constructor({ code, message }: { code: TCode; message?: string }) {
        super();
        this._message = httpErrorMessages[code] as TMessage;
        this._customMessage = message;
        this.code = code;
    }

    get message() {
        return this._customMessage ?? this._message;
    }
}