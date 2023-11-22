/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';                                                                  // https://html2canvas.hertzen.com/

import styles from '../CreateMeme.module.css';
import Draggable from './Draggable';
import CustomTextSpan from './CustomTextSpan';
import Message from '../../../../shared/messages/Message';

export default function ImageDisplay({
    template,                                                                                           // Show current selected template from user (common and from upload and from https://imgflip.com/)
    formValues,                                                                                         // Values from the user input
    inputCount,                                                                                         // How many input fields are shown (Number)
    onDownload,                                                                                         // Set true, false to isDownload
    isDownload,                                                                                         // Boolean value from start and stop download process
    onCreate,                                                                                           // Set true, false to isCreate
    isCreate,                                                                                           // Boolean value from start and stop create process
    onNewMemeDataUrl,                                                                                   // Holds base64 data from (html2canvas) for creating the meme on the server and on the cloud
}) {
    const [displayedImage, setDisplayedImage] = useState(null);                                         // Use to display template or user uploaded image
    const [serverMessage, setServerMessage] = useState({ error: '' });

    const containerRef = useRef(null);                                                                  // Use to get a reference to a div container and to take a screenshot with html2Canvas                

    useEffect(() => {                                                                                   // Triggered when download or create is clicked and when the user select new template
        if (isDownload) {
            handleCreateOrDownload('download');                                                         // Trigger the download logic
            onDownload();                                                                               // Reset the download state in the parent

        } else if (isCreate) {
            handleCreateOrDownload('create');                                                           // Trigger the create logic
            onCreate();                                                                                 // Reset the create state in the parent
        }

        setDisplayedImage(template?.url || template);                                                   // Set which template to display this from user upload or from https://imgflip.com/

    }, [isDownload, isCreate, template]);


    const handleContextMenu = (e) => {                                                                  // Disable context menu with preventDefault
        e.preventDefault();
    };

    const handleCreateOrDownload = (event) => {
        const container = containerRef.current;                                                         // Get ref to container with meme image

        html2canvas(container, { useCORS: true, })                                                      // Enable cross-origin to capture content from a cross-origin source (like an image from a different domain (html2canvas)
            .then(canvasData => {
                const dataURL = canvasData.toDataURL('image/png');                                      // Convert the canvas content to an image (html2canvas)

                if (event === 'create') {                                                               // On create set state with current screenshot and 
                    onNewMemeDataUrl(dataURL);                                                          // send to parent to make post request to server and to upload image on cloud

                } else if (event === 'download') {                                                      // Download current screenshot on user PC (html2canvas)
                    const a = document.createElement('a');                                              // Create anchor element
                    a.href = dataURL;                                                                   // Set current screenshot which format now is base64
                    a.download = 'my_meme.png';                                                         // Default name of the image when is downloaded
                    a.click();                                                                          // Trigger a click on the link to start the download
                }
            })
            .catch(error => setServerMessage({ error: error.message }));
    };

    return (
        <div onContextMenu={handleContextMenu} className={`${styles['create-image']} ${styles['unselectable']}`}>
            {(serverMessage?.error) && <Message type="error" message={serverMessage.error} />}
            {displayedImage
                ?
                <>
                    <div ref={containerRef}>
                        <Draggable>
                            <CustomTextSpan
                                top="10px"
                                left="50px"
                                fontSize={formValues['fsz-top']}
                                color={formValues['color-text-top']}
                                textOutline={formValues['color-outline-top']}
                                text={formValues['top-text']}
                            />
                        </Draggable>

                        {inputCount > 2 && (
                            Array(inputCount - 2).fill('new_text_content').map((_, index) => (
                                <Draggable key={index + 1}>
                                    <CustomTextSpan
                                        top={`${(index + 1) * 100}px`}
                                        left="50px"
                                        fontSize={formValues[`fsz-${index + 1}`]}
                                        color={formValues[`color-text-${index + 1}`]}
                                        textOutline={formValues[`color-outline-${index + 1}`]}
                                        text={formValues[`optional-text-${index + 1}`]}
                                    />
                                </Draggable>
                            ))
                        )}

                        <Draggable>
                            <CustomTextSpan
                                top="500px"
                                left="50px"
                                fontSize={formValues['fsz-bottom']}
                                color={formValues['color-text-bottom']}
                                textOutline={formValues['color-outline-bottom']}
                                text={formValues['bottom-text']}
                            />
                        </Draggable>

                        <div className={styles['image-wrapper']}>
                            <img src={displayedImage} alt="Meme" />
                        </div>

                    </div>
                </>
                :
                <h6 className={styles['create-image-select-template-heading']}>Please select template or upload your own</h6>
            }
        </div>
    );
}