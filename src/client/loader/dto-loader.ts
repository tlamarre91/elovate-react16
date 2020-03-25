import React from "react";
import * as Api from "~shared/api";
import * as Dto from "~shared/data-transfer-objects";
function withDtoLoader<T extends Dto.BaseDto<any> | Dto.BaseDto<any>[]>(wrappedComponent: React.Component<any>, query: { execute: () => Promise<Api.Response<T>> }) {
}
