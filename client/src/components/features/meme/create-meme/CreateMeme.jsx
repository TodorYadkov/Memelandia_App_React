/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

import styles from './CreateMeme.module.css';
import { useApi } from '../../../core/hooks/useApi';
import { MEME_INPUT_COUNT } from '../memeFieldConstants';
import { endpoint } from '../../../core/environments/constants';

import MemeForm from './create-components/MemeForm';
import Message from '../../../shared/messages/Message';
import ImageDisplay from './create-components/ImageDisplay';
import GetTemplateMeme from '../template-meme/GetTemplateMeme';
import CreateMemeHeader from './create-components/CreateMemeHeader';
import ScrollToTopButton from '../../../shared/scroll-to-top-button/ScrollToTopButton';

export default function CreateMeme() {
    const [currentTemplate, setCurrentTemplate] = useState(null);                                       // Used to hold user upload template or this one from https://imgflip.com/
    const [newMemeDataUrl, setNewMemeDataUrl] = useState(null);                                         // Used when creating a meme, this is a base64 string with the current screenshot of the meme
    const [inputCount, setInputCount] = useState(MEME_INPUT_COUNT);                                     // Number of text fields when creating a meme
    const [formValues, setFormValues] = useState({});                                                   // Form values: the server accept only name, category and imageData
    const [isDownload, setIsDownload] = useState(false);                                                // Trigger download process
    const [isCreate, setIsCreate] = useState(false);                                                    // Trigger create process
    const [isLoading, setIsLoading] = useState(false);                                                  // Show loading spinner
    const [serverMessage, setServerMessage] = useState({ error: '', success: '' });                     // Use to display various messages from the server 

    const api = useApi();                                                                               // Custom api requester

    useEffect(() => {
        if (newMemeDataUrl) {                                                                           // Check if has new screenshot create meme on the server and upload the image on the cloud
            setIsLoading(true);
            const { name, category } = formValues;                                                      // Get only needed values from formValues
            const serverData = {                                                                        // Create object with data to the server
                name,
                category,
                imageData: newMemeDataUrl                                                               // Add a current screenshot to be sent to the server from where it is uploaded to the cloud
            };

            api.post(endpoint.addNewMeme, serverData)                                                   // Post request to create new meme
                .then(newMemeData => {
                    setServerMessage({ success: 'You have successfully added a new meme 😊' });         // Set success message if the request is ok
                    resetForm();                                                                        // Reset the form and stay on the same page if the user wants to create more memes
                })
                .catch(error => setServerMessage({ error: error.message }))
                .finally(() => setIsLoading(false));
        }

    }, [newMemeDataUrl]);

    const submitHandler = async (e) => {                                                                // When the form is submitted, only prevents the default behavior
        e.preventDefault();
    };

    const saveCurrentInputState = (e) => {                                                              // Setting dynamic form values for each form input has a default value in the jsx itself
        const { name, value } = e.target;
        setFormValues(state => ({ ...state, [name]: value }));
    };

    const getTemplateHandler = (selectedTemplate) => {                                                  // Get current template (user upload or https://imgflip.com/)
        window.scrollTo(0, 300);                                                                        // When the template is selected, automatically the user is scrolled to the top of the page
        setCurrentTemplate(selectedTemplate);                                                           // Set selected template to be shown in ImageDisplay component                                                         
        setInputCount(selectedTemplate['box_count'] || MEME_INPUT_COUNT);                               // Set initial number of input fields
    };

    const getNewMemeDataUrl = (dataUrl) => {                                                            // When create is triggered the current screenshot is set here with a base64 string
        setNewMemeDataUrl(dataUrl);                                                                     // Set the newMemeDataUrl that will be sent to the server
    };

    const addMoreInputs = (e) => {                                                                      // Handler when more text input is added
        setInputCount(oldCount => oldCount + 1);                                                        // Increment count of the current input fields

        const { name, value } = e.target;
        setFormValues((state) => ({ ...state, [name]: value }));                                        // Set new form values
    };

    const resetForm = (e) => {                                                                          // Reset form handler
        setFormValues({});                                                                              // Clear all values in the form
        setCurrentTemplate(null);                                                                       // Remove current template                                                                      
        setInputCount(MEME_INPUT_COUNT);                                                                // Set input fields to initial state
    };

    const handleDownload = () => {                                                                      // Trigger download process
        setIsDownload(!isDownload);
    };

    const handleCreate = () => {                                                                        // Trigger create process
        setIsCreate(!isCreate);
    };

    return (
        <section className={`${styles['section-create']}`}>
            <CreateMemeHeader />

            {(serverMessage?.error) && <Message type="error" message={serverMessage.error} />}
            {(serverMessage?.success) && <Message type="success" message={serverMessage.success} />}

            <section className={styles['create-meme']}>
                <ImageDisplay
                    template={currentTemplate}
                    formValues={formValues}
                    inputCount={inputCount}
                    onDownload={handleDownload}
                    isDownload={isDownload}
                    onCreate={handleCreate}
                    isCreate={isCreate}
                    onNewMemeDataUrl={getNewMemeDataUrl}
                />

                <MemeForm
                    formValues={formValues}
                    inputCount={inputCount}
                    template={currentTemplate}
                    addMoreInputs={addMoreInputs}
                    resetForm={resetForm}
                    submitHandler={submitHandler}
                    saveCurrentInputState={saveCurrentInputState}
                    setInputCount={setInputCount}
                    onUserImageUpload={getTemplateHandler}
                    onDownload={handleDownload}
                    onCreate={handleCreate}
                    isLoading={isLoading}
                />
            </section>

            <GetTemplateMeme getTemplateHandler={getTemplateHandler} />

            <ScrollToTopButton />
        </section >
    );
}