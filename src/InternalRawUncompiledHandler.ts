type InternalRawUncompiledHandler = [
  string,
  { filename: string; lineno: number; colno: number }
];
const seen = new WeakSet<InternalRawUncompiledHandler>();
const InternalRawUncompiledHandler = {
  from(o: InternalRawUncompiledHandler): InternalRawUncompiledHandler {
    seen.add(o);
    return o;
  },
  isInternalRawUncompiledHandler(
    o: unknown
  ): o is InternalRawUncompiledHandler {
    return seen.has(o as InternalRawUncompiledHandler);
  },
};

export default InternalRawUncompiledHandler;
