/* eslint-disable no-unused-vars */
import axios from "axios";
import fs from "fs";
import { marked } from "marked";
import process from "process";

const engine = (template, ...data) => {
    return template.map((s, i) => s + `${data[i] || ""}`).join("");
};

const render = (result) => {
    if (!result || !result.data) {
        console.error("Erro: Resultado ou dados estão indefinidos.");
        return;
    }
    const title = "Star Wars API";
    const count = result.data.count;
    const items = result.data.results;
    const markdown = engine`
    <h1>${title}</h1>
    <p>Tem ${count} pessoas</p>

    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Height</th>
                <th>Mass</th>
                <th>Hair Color</th>
                <th>Skin Color</th>
                <th>Eye Color</th>
                <th>Birth Year</th>
                <th>Gender</th>
            </tr>
        </thead>
        <tbody>
            ${items
                .map((item) => {
                    return `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.height}</td>
                        <td>${item.mass}</td>
                        <td>${item.hair_color}</td>
                        <td>${item.skin_color}</td>
                        <td>${item.eye_color}</td>
                        <td>${item.birth_year}</td>
                        <td>${item.gender}</td>
                    </tr>
                    `;
                })
                .join("")}
        </tbody>
    </table>
    `;
    // console.log(marked(markdown));
    return markdown;
};

async function* paginate() {
    let page = 1;
    let result;
    while (true) {
        try {
            result = await axios.get(
                `https://swapi.dev/api/people?page=${page}`
            );
            if (result.data.next) {
                yield result;
                console.log(`Página ${page} carregada`);
                page++;
            } else {
                // Se não houver próxima página, pare
                yield result;
                console.log(`Página ${page} carregada (última página)`);
                break;
            }
        } catch (e) {
            console.error("Erro na paginação:", e);
            return;
        }
    }
}

const getData = async () => {
    let results = [];
    for await (const response of paginate()) {
        results = results.concat(response.data.results);
    }
    return {
        count: results.length,
        results,
    };
};

getData()
    .then((data) => render({ data }))
    .then((result) => {
        if (result) {
            fs.writeFile("people.html", result, (err) => {
                if (err) throw err;
                console.log("Arquivo salvo com sucesso.");
                process.exit();
            });
        }
    })
    .catch((error) => {
        console.error("Erro ao obter dados:", error);
        process.exit(1);
    });
