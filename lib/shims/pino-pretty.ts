type WritableLike = {
  write: (data: string) => boolean;
};

const noopStream: WritableLike = {
  write: () => true,
};

export default function pinoPretty(): WritableLike {
  return noopStream;
}
