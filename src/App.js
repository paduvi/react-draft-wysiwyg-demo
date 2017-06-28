import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {EditorState, ContentState} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import htmlToDraft from 'html-to-draftjs';
import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const htmlContent = `<p><p>Hey... Từng đêm qua ...
Cơn mưa bao vây chia rời đôi ta
Em ... Ngày hôm qua ...
Cuốn gió theo mây đi về nơi xa
Trời xanh rộng bao la
Anh lê đôi chân mình,
Bơ vơ lang thang có lẽ
Em đang yên vui bên nhân tình
Quên đi để anh nhớ
Hơi men để anh mơ
Nơi đâu để anh giấu
Một nỗi buồn vào trong thơ</p><img src="http://clip.vietbao.vn/wp-content/uploads/2017/03/son-tung-m-tp-va-nhung-mau-thuan-voi-gioi-underground.jpg"/></p>`;

const blocksFromHtml = htmlToDraft(htmlContent);
const contentBlocks = blocksFromHtml.contentBlocks;
const contentState = ContentState.createFromBlockArray(contentBlocks);

class Playground extends Component {

    constructor(props) {
        super(props);

        this.state = {
            editorState: EditorState.createWithContent(contentState),
        }
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    imageUploadCallBack = file => new Promise(
        (resolve, reject) => {
            const xhr = new XMLHttpRequest(); // eslint-disable-line no-undef
            xhr.open('POST', 'https://api.imgur.com/3/image');
            xhr.setRequestHeader('Authorization', 'Client-ID 8d26ccd12712fca');
            const data = new FormData(); // eslint-disable-line no-undef
            data.append('image', file);
            xhr.send(data);
            xhr.addEventListener('load', () => {
                const response = JSON.parse(xhr.responseText);
                resolve(response);
            });
            xhr.addEventListener('error', () => {
                const error = JSON.parse(xhr.responseText);
                reject(error);
            });
        }
    );

    render() {
        const {editorState} = this.state;
        return (
            <div className="playground-root">
                <div className="playground-editorSection">
                    <div className="playground-editorWrapper">
                        <Editor
                            editorState={editorState}
                            tabIndex={0}
                            hashtag={{}}
                            toolbarClassName="playground-toolbar"
                            wrapperClassName="playground-wrapper"
                            editorClassName="playground-editor"
                            toolbar={{
                                history: {inDropdown: true},
                                inline: {inDropdown: false},
                                list: {inDropdown: true},
                                link: {showOpenOptionOnHover: true},
                                textAlign: {inDropdown: true},
                                image: {uploadCallback: this.imageUploadCallBack},
                            }}
                            onEditorStateChange={this.onEditorStateChange}
                            placeholder="testing"
                            spellCheck
                            localization={{locale: 'en'}}
                            mention={{
                                separator: ' ',
                                trigger: '@',
                                caseSensitive: true,
                                suggestions: [
                                    {text: 'A', value: 'AB', url: 'href-a'},
                                    {text: 'AB', value: 'ABC', url: 'href-ab'},
                                    {text: 'ABC', value: 'ABCD', url: 'href-abc'},
                                    {text: 'ABCD', value: 'ABCDDDD', url: 'href-abcd'},
                                    {text: 'ABCDE', value: 'ABCDE', url: 'href-abcde'},
                                    {text: 'ABCDEF', value: 'ABCDEF', url: 'href-abcdef'},
                                    {text: 'ABCDEFG', value: 'ABCDEFG', url: 'href-abcdefg'},
                                ],
                            }}
                        />
                    </div>
                    <textarea
                        className="playground-content no-focus"
                        value={stateToHTML(editorState.getCurrentContent())}
                    />
                </div>
            </div>
        );
    }
}

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>Welcome to React</h2>
                </div>
                <p className="App-intro">
                    <Playground/>
                </p>
            </div>
        );
    }
}

export default App;
