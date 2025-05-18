export const makeWindowFile = (response: any, title: string, extension = 'xlsx') => {
  const url = window.URL.createObjectURL(new Blob([response]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${title}.${extension}`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const downloadProjectFile = (path: string, title: string, extension = 'xlsx') => {
  const url = `/files/${path}`;
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title}.${extension}`;
  link.click();
  link.remove();
};
