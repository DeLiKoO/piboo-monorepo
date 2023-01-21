import {decode as b64dec} from './base64';

export default function fromDataUri(uri: string) {
	if (!/^data:/i.test(uri)) {
		throw new TypeError(
			'`uri` does not appear to be a Data URI (must begin with "data:")'
		);
	}
  const firstComma = uri.indexOf(',');
	const data = unescape(uri.substring(firstComma + 1));
	return b64dec(data);
}