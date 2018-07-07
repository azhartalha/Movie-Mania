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

    nextPage()
    {
        fetch("http://127.0.0.1:8000/MM_apis/movies?page=" + (this.state.pg_no+1), {
            method: "get", 
        })
        .then( res => {
            res.json()
        .then(response =>{
            if(response.length ==0)
                return;
            this.setState(prev => ({data: response, data_loaded: true, pg_no: prev.pg_no+1}));
        })
        })
    }

    prevPage()
    {
        if(this.state.pg_no <= 1)
            return;
        fetch("http://127.0.0.1:8000/MM_apis/movies?page=" + (this.state.pg_no-1), {
            method: "get", 
        })
        .then( res => {
            res.json()
        .then(response =>{
            this.setState(prev => ({data: response, data_loaded: true, pg_no: prev.pg_no-1}));
        })
        })
    }

    ratingComp(rating, id){
        if(rating===null)
            return(<React.Fragment></React.Fragment>);
        var indents = [<div key={"rating"+id}>Rating: {rating.toFixed(1)}</div>];    
        rating = Math.floor(rating);    
        for(var i=0; i<rating; i++)
            indents.push(<span className="fa fa-star checked" key={("start"+id)+i}></span>)
        for(var i=0; i<10-rating; i++)
            indents.push(<span className="fa fa-star" key={("start"+id)+rating+i}></span>)
        return indents;
    }

    movieGenresComp(genres, id){
        if(genres.length == 0)
            return(<React.Fragment></React.Fragment>);
        var indents = []; 
        indents.push(<span key={("movie-genre"+id)+i} className="badge badge-secondary"><Link className="MM-link" to={"/moviemania/genres/"+genres[0]["id"]}>{genres[0]["name"]}</Link></span>)
        for(var i=1; i<genres.length && i<3; i++)
            indents.push(<span key={("movie-genre"+id)+i} className="badge badge-secondary"><Link className="MM-link" to={"/moviemania/genres/"+genres[i]["id"]}>{genres[i]["name"]}</Link></span>)
        return indents;
    }

    movieStarsComp(cast, id){
        if(cast.length == 0)
            return(<React.Fragment></React.Fragment>);
        var indents = [<span key={"celebs"+id}>Stars: </span>]; 
        indents.push(<span key={("movie-celebs"+id)+i}><Link to={"/moviemania/celebs_detailed/"+cast[0]["id"]}>{cast[0]["name"]}</Link></span>)
        for(var i=1; i<cast.length && i<3; i++)
            indents.push(<span key={("movie-celebs"+id)+i}><span>, </span><Link to={"/moviemania/celebs_detailed/"+cast[i]["id"]}>{cast[i]["name"]}</Link></span>)
        return indents;
    }

    render(){
        return(
            !this.state.data_loaded?
                <p>Loading...</p>:
                <div>
                    <div className="MM-page-header">
                        <button type="button" className="btn btn-info" id="MM-prev-btn" onClick={() => this.prevPage()}>prev</button>
                        <button type="button" className="btn btn-info" id="MM-next-btn" onClick={() => this.nextPage()}>next</button>
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
                                
                                <div className="movie_card">
                                  <Link to={"/moviemania/movies_detailed/"+movie.id}>
                                    <img src={"http://127.0.0.1:8000"+movie.display_picture} width="15%" height="60%" className="MM-img"/>
                                  </Link>  
                                  <div className="moviecard-inner">
                                    {(this.state.pg_no - 1)*10 + index+1 }. <Link className="MM-link-dark" to={"/moviemania/movies_detailed/"+movie.id}><b>{movie.name }</b></Link>
                                    <div>{this.movieGenresComp(movie.genres, movie.id)}</div>
                                    <div>{this.ratingComp(movie.rating, movie.id)}</div>
                                    <p>{movie.description}</p>
                                    <div>{this.movieStarsComp(movie.cast, movie.id)}</div>
                                  </div>
                                </div>
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
    }
    
    readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') {
                c = c.substring(1,c.length);
            }
            if (c.indexOf(nameEQ) == 0) {
                return c.substring(nameEQ.length,c.length);
            }
        }
        return null;
      }

    create()
    {
        const name = document.getElementById("name_field").value;
        const date = document.getElementById("release_date_field").value;
        const picture = document.getElementById("display_picture_file").files[0];
        const trailer = document.getElementById("trailer_field").value;
        const description = document.getElementById("description_field").value;
        if(name=="")
        {
            alert("Name field cannot be empty");
            return;
        }
        if(picture && picture.size> 5e+6)
        {
            alert("The file is too large");
            return;
        }
        
        var data = new FormData();
        data.append('name', name);
        data.append('description', description);
        data.append('trailer', trailer); 
        
        if(picture)
            data.append("display_picture", picture);
        
        if(date)
            data.append("release_date", date);

        fetch("http://127.0.0.1:8000/MM_apis/movies/create", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Authorization': "JWT "+this.readCookie("JWT")
            },
              body: data
        })
        .then(res => {
            if(res.status==201)
            {
                res.json()
                .then(response => this.props.history.push("/moviemania/movies_detailed/"+response.id))
            }
            else
            {
                res.json()
                .then(response => console.log(response))
            }
        })
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
            <button type="button" className="btn btn-info" onClick={() => this.create()}>create</button>
            </div>
        )
    }
}

class MovieDetailedComp extends Component{
    
    constructor(props)
    {
        super(props);
        this.state = {movie_id: props.match.params.id, data_loaded: false, data:{}};     
    }
    
    readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') {
                c = c.substring(1,c.length);
            }
            if (c.indexOf(nameEQ) == 0) {
                return c.substring(nameEQ.length,c.length);
            }
        }
        return null;
      }

    componentDidMount()
    {
        fetch("http://127.0.0.1:8000/MM_apis/movies/" + this.state.movie_id, {
           method: "get",
           headers: {
            'Authorization': "JWT "+this.readCookie("JWT")
          } 
        })
        .then( res => {
        if(res.status == 200)
             res.json()
            .then(response => {
                this.setState({data_loaded: true, data: response})
            })
        })
    }

    
    render(){
        return(
            !this.state.data_loaded?
            <div>
                Loading...
            </div>:
            <div>
                {
                    this.props.isStaff!=1?<React.Fragment></React.Fragment>: 
                    <React.Fragment>
                      <Link to={"/moviemania/movies_detailed/"+this.state.movie_id+"/update"} id="edit-movie-div">update movie</Link>
                      <hr/>
                    </React.Fragment>
                }
            </div>
        )
    }
}

export default MoviesListComp;
export {AddMovieComp, MovieDetailedComp};
