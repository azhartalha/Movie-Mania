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
                                    {
                                        !movie.release_date?<React.Fragment></React.Fragment>:
                                        <span><span> (</span>
                                        {
                                           movie.release_date.split('-')[0]
                                        }
                                        <span>)</span>   
                                    </span>
                                    }
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
           method: "get"
        })
        .then( res => {
        if(res.status == 200)
             res.json()
            .then(response => {
                this.setState({data_loaded: true, data: response})
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
        var indents = ["Genres:  "]; 
        indents.push(<span key={("movie-genre"+id)+i} className="badge badge-secondary"><Link className="MM-link" to={"/moviemania/genres/"+genres[0]["id"]}>{genres[0]["name"]}</Link></span>)
        for(var i=1; i<genres.length && i<3; i++)
            indents.push(<span key={("movie-genre"+id)+i} className="badge badge-secondary"><Link className="MM-link" to={"/moviemania/genres/"+genres[i]["id"]}>{genres[i]["name"]}</Link></span>)
        return indents;
    }

    movieCastComp(casts){
        if(casts.length===0)
            return(<React.Fragment></React.Fragment>)
        return(
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>
                            Movie cast
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        casts.map((cast, index) =>(
                            index%2?
                            <tr className="table-primary" key={"cast-movie"+cast.id}>
                                <td>
                                    <img src={"http://127.0.0.1:8000"+cast.display_picture} width="40px" height="60px"/>
                                    <Link to={"/moviemania/celebs_detailed/"+cast.id} className="empty-div">{cast.name}</Link>
                                </td>
                            </tr>:
                            <tr className="table-secondary" key={"cast-movie"+cast.id}>
                                <td>
                                    <img src={"http://127.0.0.1:8000"+cast.display_picture} width="40px" height="60px"/>
                                    <Link to={"/moviemania/celebs_detailed/"+cast.id} className="empty-div">{cast.name}</Link>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        );
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
                    <div>
                      <Link to={"/moviemania/movies_detailed/"+this.state.movie_id+"/update"} id="edit-movie-div">update movie</Link>
                    </div>
                }
                <div className="detailed">
                  <hr/><h3>{this.state.data.name}</h3><hr/>
                  {
                    !this.state.data.display_picture?<React.Fragment></React.Fragment>:
                    <div className="detail-media-div">
                    <img src={"http://127.0.0.1:8000"+this.state.data.display_picture} width="200px" height="300px" className="alignleft"/>
                    {
                      !this.state.data.trailer?<React.Fragment></React.Fragment>:
                      <iframe width="400" height="300" src={"https://www.youtube.com/embed/"+this.state.data.trailer} frameBorder="0" allowFullScreen></iframe>
                    }
                    </div>
                  }
                  <hr/>
                  <div>
                    {this.movieGenresComp(this.state.data.genres, this.state.movie_id)}
                    {this.ratingComp(this.state.data.rating, this.state.movie_id)}
                  </div>
                  <p>
                      {this.state.data.description}
                  </p>
                  <br/>
                  {this.movieCastComp(this.state.data.cast, this.state.movie_id)}
                </div>
            </div>
        )
    }
}

class UpdateMovieComp extends Component{
    constructor(props)
    {
        super(props);
        this.state ={data_loaded: false, data: {}, movie_id: props.match.params.id};
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
        fetch("http://127.0.0.1:8000/MM_apis/movies/"+this.state.movie_id , {
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

    update()
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
            data.append("born", date);

        fetch("http://127.0.0.1:8000/MM_apis/movies/"+this.state.movie_id+"/update", {
            method: "put",
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
                .then(response => this.props.history.push("/moviemania/movies_detailed/"+response))
            }
            else
            {
                res.json()
                .then(response => console.log(response))
            }
        })
    }
    addCast()
    {
        const name = document.getElementById("cast-add").value;
        if(name==="")
        {
            alert("Name cannot be empty");
            return;
        }
        fetch("http://127.0.0.1:8000/MM_apis/movies/"+this.state.movie_id+"/cast/"+name, {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Authorization': "JWT "+this.readCookie("JWT")
            }
        })
        .then(res =>{
            if(res.status==201)
            {
                alert("cast added");
                document.getElementById("cast-add").value="";
            }
            else if(res.status==404)
            {
                alert("No celeb exists with that name");
            }
        })
    }
    removeCast()
    {
        const name = document.getElementById("cast-remove").value;
        if(name==="")
        {
            alert("Name cannot be empty");
            return;
        }
        fetch("http://127.0.0.1:8000/MM_apis/movies/"+this.state.movie_id+"/cast/"+name, {
            method: "delete",
            headers: {
                'Accept': 'application/json',
                'Authorization': "JWT "+this.readCookie("JWT")
            }
        })
        .then(res =>{
            if(res.status==204)
            {
                alert("cast removed");
                document.getElementById("cast-add").value="";
            }
            else if(res.status==404)
            {
                alert("No celeb exists with that name");
            }
        })
    }
    addGenre()
    {
        const name = document.getElementById("genre-add").value;
        if(name==="")
        {
            alert("Name cannot be empty");
            return;
        }
        fetch("http://127.0.0.1:8000/MM_apis/movies/"+this.state.movie_id+"/genre/"+name, {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Authorization': "JWT "+this.readCookie("JWT")
            }
        })
        .then(res =>{
            if(res.status==201)
            {
                alert("genre added");
                document.getElementById("cast-add").value="";
            }
            else if(res.status==404)
            {
                alert("No genre exists with that name");
            }
        })
    }
    removeGenre()
    {
        const name = document.getElementById("genre-remove").value;
        if(name==="")
        {
            alert("Name cannot be empty");
            return;
        }
        fetch("http://127.0.0.1:8000/MM_apis/movies/"+this.state.movie_id+"/genre/"+name, {
            method: "delete",
            headers: {
                'Accept': 'application/json',
                'Authorization': "JWT "+this.readCookie("JWT")
            }
        })
        .then(res =>{
            if(res.status==204)
            {
                alert("genre removed");
                document.getElementById("cast-add").value="";
            }
            else if(res.status==404)
            {
                alert("No genre exists with that name");
            }
        })
    }
    render(){
        if(this.props.isStaff=="1")
        return(
            !this.state.data_loaded?
            <p>Loding...</p>:
            <div>
            <div>
                <Link className="alignleft" to={"/moviemania/movies_detailed/"+this.state.movie_id}>Movie Page(back)</Link>
            </div>
            <br/>
            <hr/>
            <h4>Update Movie Cast</h4><br/>
            <div className="MM-update-bars">
            <div className="form-inline my-2 my-lg-0">
                <input className="form-control mr-sm-2" type="text" id="cast-add" placeholder="cast name"/>
                <button onClick={()=>this.addCast()} className="btn btn-info my-2 my-sm-0"><span className="span-width">add</span></button>
            </div>
            <br/>
            <div className="form-inline my-2 my-lg-0">
                <input className="form-control mr-sm-2" type="text" id="cast-remove" placeholder="cast name"/>
                <button onClick={()=>this.removeCast()} className="btn btn-danger my-2 my-sm-0">remove</button>
            </div>
            </div>
            <br/>
            <hr/><h4>Update Movie Genres</h4><br/>    
            <div className="MM-update-bars">
            <div className="form-inline my-2 my-lg-0">
                <input className="form-control mr-sm-2" type="text" id="genre-add" placeholder="genre name"/>
                <button onClick={()=>this.addGenre()} className="btn btn-info my-2 my-sm-0"><span className="span-width">add</span></button>
            </div>
            <br/>
            <div className="form-inline my-2 my-lg-0">
                <input className="form-control mr-sm-2" type="text" id="genre-remove" placeholder="genre name"/>
                <button onClick={()=>this.removeGenre()} className="btn btn-danger my-2 my-sm-0">remove</button>
            </div>
            </div>
            <br/>
            <hr/>
            <h4>Update Movie Details</h4><br/>
            <table className="table table-hover">
            <tbody>
                <tr>
                    <td>
                        Movie Name
                    </td>
                    <td>
                        <input className="form-control mr-sm-2" type="text" id="name_field" defaultValue={this.state.data.name} placeholder="name *"/>
                    </td>
                </tr>
                <tr>
                    <td>
                        Release date
                    </td>
                    <td>
                        <input defaultValue={this.state.data.release_date} type="date" id="release_date_field"/><br/>
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
                        <input className="form-control mr-sm-2" type="text" defaultValue={this.state.data.trailer} id="trailer_field" placeholder="trailer url"/>                        
                    </td>
                </tr>
                <tr>
                    <td>
                        Movie description
                    </td>
                    <td>
                        <textarea className="form-control" rows="3" id="description_field" defaultValue={this.state.data.description} placeholder="description"></textarea>
                    </td>
                </tr>
            </tbody>
            </table>
            <button type="button" className="btn btn-info" onClick={() => this.update()}>Update</button>
            </div>
        )
        else
        return <Redirect to="/moviemania/celebs"/>
    }
}

export default MoviesListComp;
export {AddMovieComp, MovieDetailedComp, UpdateMovieComp};
