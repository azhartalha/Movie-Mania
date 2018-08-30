import React, {Component} from 'react';

class HomeComp extends Component
{
    render()
    {
        var container = {
            width: "800px",
            height: "500px",
            position: "relative"
        };

        var headerContainer = {
            padding: "20px"
        };
         var leftCont = {
             position: "absolute",
             top: "25%",
             left: "0%",
            width: "560px",
            color: "navy",
            fontSize: "16px",
        }
        var ancor = {
            color: "red"
        }
        
        var myImg = {
            borderRadius: "50%",
            marginBottom: "10px"
        }

        return(
            <div style={container}>
                <div style={headerContainer}>
                    <h3>Welcome to MovieMania!</h3>
                    <hr/>
                </div>
                <div className="alignright">
                    <img style={myImg} src="https://scontent.fhyd1-2.fna.fbcdn.net/v/t1.0-9/40006407_1913132192109890_7333126001825677312_n.jpg?_nc_cat=0&oh=5a7f399b71f20025139a3dd6a5f7264c&oe=5C3358E5" width="150px" height="150px"/>
                    <br/>
                    <p ><a style={ancor} href="https://www.linkedin.com/in/azhar-talha-syed"><i>~Azhar Talha Syed~</i></a></p>
                </div>
                <div style={leftCont}>
                    Hello I am <a style={ancor} href="https://www.linkedin.com/in/azhar-talha-syed">Azhar</a>, the founder and developer of MovieMania. MovieMania is a clone of IMDB which is a website where
                    people can find all the data related to movies and review them. This is a single page webapp buit using
                    React.js and django-rest framework. There are three types of users Admin, staff and a normal user, if you want to have the 
                    staff permissions please message me your username of the account that you have created in moviemania on linkedIn, you will be able to add movies/celebs, update movies/celebs and add celebs/genres to movie etc.. Basically all
                    the CURD operations. but as a normal user you only get to add reviws to the movies. The main agenda of building this application was to develop a full stack
                    webapp on my own and get proficient at the mentioned frameworks. Here is the link to the <a style={ancor} href="https://github.com/azhartalha/Movie-Mania">GitHub repo</a> of the website
                    walk throught the code and use the website if you are intrested. :)
                </div>
            </div>
        );
    }
}

export default HomeComp;