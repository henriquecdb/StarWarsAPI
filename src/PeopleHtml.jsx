/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";

const PeopleHtml = () => {
    const [htmlContent, setHtmlContent] = useState("");

    useEffect(() => {
        fetch("/people.html")
            .then((response) => response.text())
            .then((text) => setHtmlContent(text))
            .catch((err) => console.error("Erro ao carregar HTML:", err));
    }, []);

    return (
        <div className="centralizado">
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
    );
};

export default PeopleHtml;
