import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col, ListGroup } from "react-bootstrap";
import axios from "axios";
import SuggestionEntity from "./SuggestionEntity";
import SearchEntity from "./SearchEntity";
import SearchResultsList from "./SearchResultsList";
import { isEmptyResponse } from "../../Utils";
import './SearchForm.css';

import { suggestionsMock } from './suggestions.mock';

/**
 * The search form is meant to help a user select entities from a vocabulary
 * by entering the first letters of entity labels and obtaining a list of suggestions (auto-completion).
 *
 * The whole component consists of 3 elements:
 * - a simple form with an input field and a search button
 * - a list of suggested entities to perform auto-completion based on the input field
 * - a list of entities already selected by the user, those can be removed.
 *
 * When clicking the search button, the selected entities are used to perform different semantic searches.
 *
 * @returns {JSX.Element}
 * @constructor
 */
function SearchForm() {
    // Term typed in the input field
    const [input, setInput] = useState('');

    // Suggestions for autocompletion.
    // Each suggestion should be an object like {entityLabel: "...", entityUri: "...", entityPrefLabel: "..."}
    const [suggestions, setSuggestions] = useState([]);

    // Search entities already selected
    const [searchEntities, setSearchEntities] = useState([]);

    // Status of the search button
    const [isLoading, setLoading] = useState(false);

    // Results returned by the last search
    const [searchResults, setSearchResults] = useState([]);

    const [searchResultsSubConcept, setSearchResultsSubconcept] = useState([]);

    const [searchResultsRelated, setSearchResultsRelated] = useState([]);


    /**
     * Use the autocomplete service to propose suggestions based on the current input value.
     */
    useEffect(() => {
        if (input.length < process.env.REACT_APP_MIN_SIZE_FOR_AUTOCOMPLETE) {
            setSuggestions([]);
        } else {
            if (process.env.REACT_APP_USE_MOCK_AUTOCOMPLETE_SERVICE === "true") {

                // -----------------------------------------------
                // Use a mock suggestion service for tests
                // -----------------------------------------------
                const filteredSuggestions = suggestionsMock.filter(
                    (_s) => _s.entityLabel.toLowerCase().includes(input)
                );
                setSuggestions(filteredSuggestions);
            } else {

                // -----------------------------------------------
                // Invoke the auto-completion service
                // -----------------------------------------------

                let query = process.env.REACT_APP_BACKEND_URL + "/autoComplete/?input=" + input;
                if (process.env.REACT_APP_LOG === "on") {
                    console.log("Will submit backend query: " + query);
                }
                axios(query).then(response => {
                    if (response.data === undefined) {
                        // If there is no suggestion, empty the previous list of suggestions
                        setSuggestions([]);
                    } else {
                        let newSuggestions = response.data.filter(
                            // Do not suggest an entity that is already in the list of selected entities
                            _s => !searchEntities.some(_e => _e.entityLabel.toLowerCase() === _s.entityLabel.toLowerCase()
                                && _s.entityUri === _e.entityUri)
                        );
                        setSuggestions(newSuggestions);
                        if (process.env.REACT_APP_LOG === "on") {
                            console.log("------------------------- Retrieved " + newSuggestions.length + " suggestions.");
                            //newSuggestions.forEach(e => console.log(e));
                        }
                    }
                })
            }
        }
        //eslint-disable-next-line
    }, [input]);


    /**
     * Enter is like clicking on the search button
     * @param {Object} e - event
     */
    const handleInputKeyUp = (e) => {
        if (e.key === 'Escape') {
            setSuggestions([]); // Clear suggestions on Escape
        }

        // if (e.key === 'Enter' && input.trim() !== '') {
        //     // @TODO - possible to use the arrows to navigate the suggestions and enter to select one?
        //     setInput('');
        //     setSuggestions([]); // Clear suggestions when an item is added
        // }
    };

    /**
     * When a suggestion is selected, it is added to the selected entities and
     * the input field and suggestions list are cleared.
     * @param {number} index - index of the selected suggestion
     */
    const handleSelectSuggestion = (index) => {
        let newEntity = {
            entityLabel: suggestions[index].entityLabel,
            entityUri: suggestions[index].entityUri,
            entityPrefLabel: '(' + suggestions[index].entityPrefLabel + ')'
        };
        setSearchEntities([...searchEntities, newEntity]);
        setInput('');
        setSuggestions([]);
    };

    /**
     * Remove one entity from the selected entities
     * @param {number} index
     */
    const handleRemoveEntity = (index) => {
        if (process.env.REACT_APP_LOG === "on") {
            console.log("Removing entity: " + searchEntities[index].entityLabel);
        }
        const newEntities = [...searchEntities];
        newEntities.splice(index, 1);
        setSearchEntities(newEntities);
        if (process.env.REACT_APP_LOG === "on") {
            if (newEntities.length === 0)
                console.log("Removed all entities.");
        }
    };


    /**
     * Search documents matching exactly the selected entities.
     * Triggered by the search button
     */
    useEffect(() => {
        setSearchResultsSubconcept([]);
        setSearchResultsRelated([]);
        if (isLoading) {
            if (searchEntities.length === 0) {
                if (process.env.REACT_APP_LOG === "on") {
                    console.log("------------------------- No search entity was selected, not invoking search service.");
                }
                setLoading(false);
                setSearchResults([]);
            } else {
                let query = process.env.REACT_APP_BACKEND_URL + "/searchDocuments/?uri=" + searchEntities.map(_s => _s.entityUri).join(',');
                if (process.env.REACT_APP_LOG === "on") {
                    console.log("Will submit backend query: " + query);
                }
                axios(query).then(response => {
                    setLoading(false);
                    if (isEmptyResponse(query, response)) {
                        setSearchResults([]);
                    } else {
                        let _results = response.data.result;
                        if (process.env.REACT_APP_LOG === "on") {
                            console.log("------------------------- Retrieved " + _results.length + " search results.");
                            //_results.forEach(e => console.log(e));
                        }
                        setSearchResults(_results);
                    }
                })
            }
        }
        //eslint-disable-next-line
    }, [isLoading]);


    /**
     * Search for documents that match the selected concepts including their sub-concepts.
     * Started after getting the exact match results.
     */
    useEffect(() => {
        let query = process.env.REACT_APP_BACKEND_URL + "/searchDocumentsSubConcept/?uri=" + searchEntities.map(_s => _s.entityUri).join(',');
        if (process.env.REACT_APP_LOG === "on") {
            console.log("Will submit backend query: " + query);
        }
        axios(query).then(response => {
            if (isEmptyResponse(query, response)) {
                setSearchResultsSubconcept([]);
            } else {
                let _results = response.data.result;
                if (process.env.REACT_APP_LOG === "on") {
                    console.log("------------------------- Retrieved " + _results.length + " search results.");
                    //_results.forEach(e => console.log(e));
                }

                // Filter the results to keep only those documents that were not in the first set of results (with exact match)
                let additionalResults = _results.filter((_a) =>
                    !searchResults.find((_r) => _r.document === _a.document)
                );
                setSearchResultsSubconcept(additionalResults);
            }
        })
        //eslint-disable-next-line
    }, [searchResults]);


    /**
     * Search for documents that match concepts related to the selected concepts
     * Started after getting the exact match results.
     */
    useEffect(() => {
        let query = process.env.REACT_APP_BACKEND_URL + "/searchDocumentsRelated/?uri=" + searchEntities.map(_s => _s.entityUri).join(',');
        if (process.env.REACT_APP_LOG === "on") {
            console.log("Will submit backend query: " + query);
        }
        axios(query).then(response => {
            if (isEmptyResponse(query, response)) {
                setSearchResultsRelated([]);
            } else {
                let _results = response.data.result;
                if (process.env.REACT_APP_LOG === "on") {
                    console.log("------------------------- Retrieved " + _results.length + " search results.");
                    //_results.forEach(e => console.log(e));
                }

                // Filter the results to keep only those documents that were not in the previous sets of results
                let additionalResults = _results.filter((_a) =>
                    !searchResults.find((_r) => _r.document === _a.document)

                );
                setSearchResultsRelated(additionalResults);
            }
        })
        //eslint-disable-next-line
    }, [searchResultsSubConcept]);


    return (
        <>
            <div className="component">
                <h1 className="">Search documents by Entity</h1>
                <div className="multiple-inputs-container">

                    { /* List of the search entities that have already been selected */}
                    <div className="entity-list">
                        {searchEntities.map((entity, index) => (
                            <SearchEntity key={index} id={index}
                                entityLabel={entity.entityLabel}
                                entityUri={entity.entityUri}
                                entityPrefLabel={entity.entityPrefLabel}
                                handleRemove={handleRemoveEntity}
                            />
                        ))}
                    </div>

                    <Form>
                        { /* Input field and search button */}
                        <Row className="mb-1">
                            <Col xs={10}>
                                <Form.Control type="text" className="input-field"
                                    placeholder="Enter text and select a suggestion"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyUp={handleInputKeyUp}
                                />
                            </Col>
                            <Col xs={2}>
                                <Button id="search-button" className="search-button" variant="secondary"
                                    disabled={isLoading}
                                    onClick={!isLoading ? () => setLoading(true) : null}>
                                    {isLoading ? 'Searching...' : 'Search'}
                                </Button>
                            </Col>
                        </Row>
                        { /* <Row className="mx-3">
                        <Col>
                            <Form.Switch
                                id="search-switch"
                                label="Also search full-text"
                                className="search-switch"
                            />
                        </Col>
                    </Row> */}

                        { /* Auto-complete: list of suggestions of entities base on the input */}
                        <ListGroup className="suggestion-list overflow-auto">
                            {suggestions.map((suggestion, index) => (
                                <SuggestionEntity key={index} id={index}
                                    input={input}
                                    entityLabel={suggestion.entityLabel}
                                    entityUri={suggestion.entityUri}
                                    entityPrefLabel={suggestion.entityPrefLabel}
                                    entityCount={suggestion.count}
                                    source={suggestion.source}
                                    handleSelect={handleSelectSuggestion}
                                />
                            ))}
                        </ListGroup>
                    </Form>

                </div>
            </div>

            { /* ========================================================================================== */}

            {
                searchResults.length !== 0 ?
                    <div className="component">
                        { /* Search results and buttons to navigate the pages */}
                        <div className="content_header">Results matching only the selected Entity</div>
                        <SearchResultsList searchResults={searchResults} />
                    </div>
                    : null
            }

            {
                searchResultsSubConcept.length !== 0 ?
                    <div className="component">
                        { /* Search results and buttons to navigate the pages */}
                        <div className="content_header">Results matching the selected Entity or any more specific Entities
                        </div>
                        <SearchResultsList searchResults={searchResultsSubConcept} />
                    </div>
                    : null
            }

            {
                searchResultsRelated.length !== 0 ?
                    <div className="component">
                        { /* Search results and buttons to navigate the pages */}
                        <div className="content_header">Results matching Entities related to those selected
                        </div>
                        <SearchResultsList searchResults={searchResultsRelated} />
                    </div>
                    : null
            }

        </>
    );
}

export default SearchForm;
