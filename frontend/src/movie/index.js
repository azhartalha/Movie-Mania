import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Redirect, Link} from "react-router-dom";

class MoviesListComp extends Component{
    constructor(props)
    {
        super(props);
        this.state = {pg_no: 1, data:[], data_loaded: false};     
    }
    
    componentDidMount()
    {
        fetch("http://127.0.0.1:8000/MM_apis/movies?page=" + this.state.pg_no, {
           method: "get", 
        })
        .then( res => {
            res.json()
        .then(response =>{
            this.setState({data: response, data_loaded: true});
        })
        })
    }


    render(){
        return(
            !this.state.data_loaded?
                <p>Loading...</p>:
                <div>
                    <div className="MM-page-header">
                        <button type="button" className="btn btn-info" id="MM-prev-btn" onClick={() => console.log("prev")}>prev</button>
                        <button type="button" className="btn btn-info" id="MM-next-btn" onClick={() => console.log("next")}>next</button>
                        {
                            this.props.isStaff=="1"?<Link className="btn btn-info" id="MM-add-link" to="/moviemania/movies/create">Add movie</Link>:<React.Fragment></React.Fragment>
                        }
                    </div>
                    <table className="table table-hover">
                        <tbody>
                        {
                            this.state.data.map(
                                (movie, index) =>
                            <tr key={"table row "+movie.id}>
                              <td>
                                <Link to={"/moviemania/movies_detailed/"+movie.id}>
                                <div className="movie_card">
                                  <img src={"http://127.0.0.1:8000"+movie.display_picture} width="15%" height="60%" className="MM-img"/>
                                  <div>
                                      {index+1 }. {movie.name } {movie.rating}
                                  </div>
                                </div>    
                                </Link>
                              </td>
                            </tr>
                            )
                        }
                        </tbody>
                    </table>
                </div>
        )
    }
}

class AddMovieComp extends Component{
    constructor(props)
    {
        super(props);
        this.state = {created: false, movie_id: -1};     
    }
    
    render(){
        return(
            this.props.isStaff!="1"?
            <Redirect to="/moviemania/movies"/>:
            <div>
            <table className="table table-hover">
            <tbody>
                <tr>
                    <td>
                        Movie Name
                    </td>
                    <td>
                        <input className="form-control mr-sm-2" type="text" id="name_field" placeholder="name *"/>
                    </td>
                </tr>
                <tr>
                    <td>
                        Release date
                    </td>
                    <td>
                        <input type="date" id="release_date_field"/><br/>
                    </td>
                </tr>
                <tr>
                    <td>
                        Display picture
                    </td>
                    <td>
                        <input type="file" id="display_picture_file"/>
                    </td>
                </tr>
                <tr>
                    <td>
                        Movie trailer
                    </td>
                    <td>
                        <input className="form-control mr-sm-2" type="text" id="trailer_field" placeholder="trailer url"/>
                    </td>
                </tr>
                <tr>
                    <td>
                        Movie description
                    </td>
                    <td>
                        <textarea className="form-control" rows="3" id="description_field" placeholder="description"></textarea>
                    </td>
                </tr>
            </tbody>
            </table>
            <button type="button" className="btn btn-info" onClick={() => console.log("Added movie")}>create</button>
            </div>
        )
    }
}

export default MoviesListComp;
export {AddMovieComp};