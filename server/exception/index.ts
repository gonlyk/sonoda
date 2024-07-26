export class NoPermissionError extends Error  { constructor(message = 'NoPermissionError') { super(message) } }
export class ResourceNotExistError extends Error  { constructor(message = 'ResourceNotExistError') { super(message) } }
export class DatabaseError extends Error  { constructor(message = 'DatabaseError') { super(message) } }
export class NoParameError extends Error  { constructor(message = 'NoParameError') { super(message) } }
export class InvalidParameterError extends Error { constructor(message = 'InvalidParameterError') { super(message) } }