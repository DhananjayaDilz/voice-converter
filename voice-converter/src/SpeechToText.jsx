import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@material-tailwind/react";
import { jsPDF } from "jspdf";
import { FiDownload } from "react-icons/fi";


const SpeechToText = () => {
    const [finalText, setFinalText] = useState('');
    const [interimText, setInterimText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [pdfs, setPdfs] = useState([]);
    const recognitionRef = useRef(null);

    useEffect(() => {
        fetchPdfs();
    }, []);

    const fetchPdfs = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/user/pdfs');
            const data = await response.json();
            console.log(data);
            setPdfs(data);
        } catch (error) {
            console.error('Error fetching PDFs:', error);
        }
    };

    const handleListen = () => {
        if (!recognitionRef.current) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript + ' ';
                    } else {
                        interimTranscript += transcript;
                    }
                }

                setFinalText((prevText) => prevText + finalTranscript);
                setInterimText(interimTranscript);
            };

            recognitionRef.current = recognition;
        }

        recognitionRef.current.start();
    };

    const handleStop = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    const handleClear = () => {
        setFinalText('');
        setInterimText('');
    };

    const handleDownloadPDF = (base64String, fileName) => {
        const link = document.createElement('a');
        link.href = base64String;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSaveToPDF = async () => {
        const pdfName = prompt("Enter the name for the PDF file:");
        if (pdfName) {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const margins = 10;
            const text = finalText + interimText;
            const textArray = doc.splitTextToSize(text, pageWidth - margins * 2);
            doc.text(textArray, margins, margins);

            const pdfBlob = doc.output('blob');
            const formData = new FormData();
            formData.append('file', pdfBlob, `${pdfName}.pdf`);

            try {
                const response = await fetch('http://localhost:3001/api/user/upload', {
                    method: 'POST',
                    body: formData,
                });
                if (response.ok) {
                    alert('PDF saved successfully!');
                    fetchPdfs();  // Fetch the updated list of PDFs
                } else {
                    alert('Failed to save PDF.');
                }
            } catch (error) {
                console.error('Error saving PDF:', error);
                alert('Error saving PDF.');
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-pink-100">
            <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4 text-center">Speech to Text Converter</h1>
                <div className="flex justify-center mb-4 justify-around">
                    <Button variant="gradient" color="pink"
                        onClick={handleListen}
                        disabled={isListening}>
                        Start Recording
                    </Button>
                    <Button variant="gradient" color="pink"
                        onClick={handleStop}
                        disabled={!isListening}>
                        Stop Recording
                    </Button>
                    <Button variant="gradient" color="pink"
                        onClick={handleClear}>
                        Clear Text
                    </Button>
                </div>
                <div className="p-4 border rounded-lg min-h-[200px] bg-gray-50 overflow-y-auto">
                    <p className="text-gray-800 whitespace-pre-wrap">
                        {finalText + interimText}
                    </p>
                </div>
                <div className="flex justify-center mt-2">
                    <Button variant="gradient" color="pink" onClick={handleSaveToPDF}>
                        Save to PDF
                    </Button>
                </div>
               
            </div>
            <div className="mt-8 w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 text-center">Saved PDFs</h2>
                    <ul>
                        {pdfs.map((pdf) => (
                            <div key={pdf._id} className="mb-2 flex items-center ">
                                <div className='w-3/12 flex justify-between'>
                                <p className='mr-7'>{pdf.name}</p>
                                <Button  size="sm" variant="gradient" color="pink" 
                                    onClick={() => handleDownloadPDF(`data:application/pdf;base64,${btoa(String.fromCharCode(...new Uint8Array(pdf.pdf.data)))}`, pdf.name)}>
                                   <FiDownload/>
                               
                                </Button>
                                </div>
                            </div>
                        ))}
                    </ul>
                </div>
        </div>
    );
};

export default SpeechToText;
