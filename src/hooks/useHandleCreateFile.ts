import axiosInstance from '../app/api/axiosInstance';
import { FileNodeType } from '@/types/IDE/FileTree/FileDataTypes';
import { useFileTreeStore } from '@/store/useFileTreeStore';
import useProjectStore from '@/store/useProjectStore';

const useHandleCreateFile = () => {
  const projectId = useProjectStore.getState().currentProject.id;

  const handleCreateFileRequest = async (
    node: FileNodeType,
    newNodeName: string
  ) => {
    try {
      let sendFilePath;
      const nowFilePath = useFileTreeStore.getState().findNodePath(node.id);

      if (nowFilePath == null) {
        sendFilePath = '/' + newNodeName;
      } else {
        sendFilePath = nowFilePath + newNodeName;
      }

      let responseData;

      if (node.type === 'FILE') {
        const response = await axiosInstance.post('/api/files', {
          projectId: projectId,
          directories: null,
          files: sendFilePath,
          content: '',
        });
        responseData = response.data;
      } else {
        const response = await axiosInstance.post('/api/files', {
          projectId: projectId,
          directories: sendFilePath,
          files: null,
          content: '',
        });
        responseData = response.data;
      }

      return responseData;
    } catch (error) {
      console.error(error);
    }
  };
  return handleCreateFileRequest;
};

export default useHandleCreateFile;
