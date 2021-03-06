import React from "react";
import { Upload, Modal, Icon, message } from "antd";
import PropTypes from "prop-types";
import { BASE_IMG_URL } from "../../utils/constants";
import { reqDeleteImg } from "../../api";
/*
用于图片上传
*/
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

class PicturesWall extends React.Component {
  static propTypes = {
    imgs: PropTypes.array,
  };
  state = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
  };
  constructor(props) {
    super(props);
    let fileList = [];
    const { imgs } = this.props;
    if (imgs && imgs.length > 0) {
      fileList = imgs.map((img, index) => ({
        uid: -index,
        name: img,
        status: "done",
        url: BASE_IMG_URL + img,
      }));
    }
    this.state = {
      previewVisible: false,
      previewImage: "",
      previewTitle: "",
      fileList, //所有已上传图片的数组
    };
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
  };

  handleChange = async ({ file, fileList }) => {
    // 一旦上传成功，将当前上传的file信息进行修正(name,url)
    if (file.status === "done") {
      const result = file.response; // {status:0,data:{name:'xxx.jpg',url:'图片地址'}}
      if (result.status === 0) {
        message.success("上传图片成功");
        const { name, url } = result.data;
        file = fileList[fileList.length - 1];
        file.name = name;
        file.url = url;
      } else {
        message.error("上传图片失败");
      }
    } else if (file.status === "removed") {
      // 删除图片
      console.log(file);
      const result = await reqDeleteImg(file.name);
      if (result.status === 0) {
        message.success("删除图片成功");
      } else {
        message.error("删除图片失败");
      }
    }
    this.setState({ fileList });
  };
  /* 获取所有已上传文件名的数组 */
  getImgs = () => {
    return this.state.fileList.map((file) => file.name);
  };

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div>Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload" /* 图片接口地址 */
          accept={"image/*"} /* 只接受图片格式 */
          name="image"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PicturesWall;
