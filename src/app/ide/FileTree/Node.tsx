import { AiFillFolder, AiFillFolderOpen, AiOutlineFile } from 'react-icons/ai';
import { NodeRendererProps } from 'react-arborist';
import { MdArrowRight, MdArrowDropDown } from 'react-icons/md';
import { MdEdit } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';
import { FileDiv, NodeContainer } from './FileTree.styles';
import React from 'react';
import axiosInstance from '@/app/api/axiosInstance';
import { findNowFilePath } from '@/utils/fileTreeUtils';
import { useFileTreeStore } from '@/store/useFileTreeStore';
import { FileNodeType } from '@/types/IDE/FileTree/FileDataTypes';
import useCurrentOpenFileList from '@/store/useCurrentOpenFile';

export const Node = ({
  node,
  style,
  dragHandle,
  tree,
}: NodeRendererProps<FileNodeType>) => {
  const { updateNodeName } = useFileTreeStore();
  const { setOpenFilesIdList } = useCurrentOpenFileList();
  const projectId = 'ebc63279-89b9-4b1d-bb4d-1270130c3d4d'; //임시

  const handleOpenFile = async () => {
    try {
      const nowFilePath = findNowFilePath(node);
      const params = { projectId: projectId, filePath: nowFilePath };

      const { data } = await axiosInstance.get('/api/files', {
        params: params,
      });

      //응답받은 filename, content .. 등 필요 정보 담아두기 -> 총미

      //열린 파일 목록 업데이트 -> 총미
      setOpenFilesIdList(node.id);

      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateFileRequest = async (newNodeName: string) => {
    try {
      const nowFilePath = findNowFilePath(node) + newNodeName;
      let responseData;

      //directory or file 구별
      if (node.isInternal) {
        const response = await axiosInstance.post('/api/files', {
          projectId: projectId,
          directories: nowFilePath,
          files: null,
          content: 'print("Hello, World!")',
        });
        responseData = response.data;
      } else {
        const response = await axiosInstance.post('/api/files', {
          projectId: projectId,
          directories: null,
          files: nowFilePath,
          content: 'print("Hello, World!")',
        });
        responseData = response.data;
      }

      //응답받은 filename, content .. 등 필요 정보 담아두기 -> 총미

      //열린 파일 목록 업데이트 -> 총미
      setOpenFilesIdList(node.id);

      return responseData;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <NodeContainer className="node-container" style={style} ref={dragHandle}>
      <FileDiv
        className="node-content"
        onClick={() => node.isInternal && node.toggle()}
      >
        {node.isLeaf ? (
          <>
            <AiOutlineFile size="18px" style={{ margin: '0 2px 0 16px' }} />
          </>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {node.isOpen ? (
                <>
                  <MdArrowDropDown />
                  <AiFillFolderOpen
                    size="18px"
                    style={{ margin: '0 2px 0 0 ' }}
                  />
                </>
              ) : (
                <>
                  <MdArrowRight />{' '}
                  <AiFillFolder size="18px" style={{ margin: '0 2px 0 0' }} />
                </>
              )}
            </div>
          </>
        )}

        {/* node text */}
        <span
          className="node-text"
          onClick={handleOpenFile}
          onDoubleClick={(e: React.MouseEvent<HTMLSpanElement>) => {
            e.preventDefault();
            node.edit();
          }}
        >
          {node.isEditing ? (
            <input
              type="text"
              defaultValue={node.data.name}
              onFocus={e => e.currentTarget.select()}
              onBlur={() => node.reset()}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Escape') node.reset();
                if (e.key === 'Enter') {
                  //이때 서버로도 메시지 보내야 함. 성공시 아래 코드 실행
                  handleCreateFileRequest(e.currentTarget.value);
                  updateNodeName(node.id, e.currentTarget.value);
                  node.submit(e.currentTarget.value);
                }
              }}
              autoFocus
            />
          ) : (
            <span>{node.data.name}</span>
          )}
        </span>
      </FileDiv>

      <div className="file-actions">
        <div className="folderFileActions">
          <button onClick={() => node.edit()} title="Rename...">
            <MdEdit />
          </button>
          <button
            onClick={() => {
              tree.delete(node.id);
            }}
            title="Delete"
          >
            <RxCross2 />
          </button>
        </div>
      </div>
    </NodeContainer>
  );
};
