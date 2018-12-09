exports.registerTaskGroup = (app, db) =>{
    app.get('/taskGroups', (req, res) => {
        if(db.getAll('TaskGroup').length > 0){
            res.status(200);
            res.json(db.getAll('TaskGroup'));
        }
        else{
            res.status(404).send("Error 404 : No Task-Groups found!");
        }
    })

    app.post('/taskGroups', (req, res) => {
        const taskGroup_name = req.body.name;
        const taskGroup_numberTasks = req.body.numberTasks;
        const taskGroup_id = db.getNewId('TaskGroup');
        const taskGroup_tasks = req.body.tasks;

        if(taskGroup_name == null){
            res.status(400).send("Error 400 : You must insert a valid taskGroup name!");
        } else if(taskGroup_tasks == null){
            res.status(400).send("You must insert a taskGroup task list valid!");
        } else if(taskGroup_id == null){
            res.status(400).send("Error 400 : Something went wrong! (id null)");
        }else if(!isNaN(taskGroup_name)){
            res.status(400).send("Error 400 : You must insert a valid taskGroup name!");
        }else if(!Array.isArray(taskGroup_tasks)){
            res.status(400).send("Error 400 : Something went wrong! (tasks not an array)");
        }else if(Array.isArray(taskGroup_tasks) && taskGroup_numberTasks!=null && taskGroup_numberTasks!=taskGroup_tasks.length){
            res.status(400).send("Error 400 : Something went wrong! (numbertasks error)");
        }else{

            let controllo1 = true
            let controllo2 = true

           if(taskGroup_numberTasks==null){
            taskGroup_numberTask = taskGroup_tasks.length;
            }

            for(let i = 0; i<taskGroup_tasks.length; i++){
                if(isNaN(taskGroup_tasks[i])){
                    controllo1 = false;
                }

                const controllo_task = db.getById('Task', taskGroup_tasks[i])
                if(controllo_task == null){
                    controllo2 = false;
                }
            }

            if(controllo1 && controllo2){
                    const new_taskGroup =  {id: taskGroup_id, name: taskGroup_name, numberTasks: taskGroup_numberTasks, tasks: taskGroup_tasks};
                    db.addItem('TaskGroup', new_taskGroup);
                    res.status(201);
                    res.json(new_taskGroup);
            }else{
                if(!controllo1){
                    res.status(400).send("Error 400 : Something went wrong! (tasks array contains NaN object)");
                }else{
                    res.status(400).send("Error 400 : Something went wrong! (tasks array contains invalid taskGroupID)");
                }
            }

        }
    })

    app.delete('/taskGroups', (req, res) =>{
        
        if(db.deleteAll('TaskGroup')){
            res.status(200).send("All taskGroups deleted");
            // console.log('All the taskGroup have been deleted successfully');
        }else{
            res.status(400).send("Error 400 : Something went wrong!");
        }

    })

    app.get('/taskGroups/:taskGroupID' , (req, res) =>{

        const taskGroup_searched = db.getById('TaskGroup', req.params.taskGroupID);
        if(taskGroup_searched == null){
            res.status(404).send('404 - We are sorry. No taskGroup found with given id');
        }
        else{
            res.json(taskGroup_searched);
            res.status(200);
        }

    })

    app.put('/taskGroups/:taskGroupID' , (req, res) =>{

        let taskGroup_searched = db.getById('TaskGroup', req.params.taskGroupID);

        if(taskGroup_searched == null){
            res.status(404).send('404 - We are sorry. No taskGroup found with given id');
        } 
        else {

            const update_name = req.body.name;
            const update_tasks = req.body.tasks;
            const update_numbertasks = req.body.numberTasks;

            if(update_name!=null && !isNaN(update_name)){
                res.status(409).send("Error 409 : You have to insert a valid taskGroup name!");
            } else if(update_tasks!=null && !Array.isArray(update_tasks)){
                res.status(409).send("Error 409 : Something went wrong! (task array null or not an array)");
            }  else if(update_numbertasks!=null && isNaN(update_numbertasks)){
                res.status(409).send("Error 409 : Something went wrong! (numbertasks error)");
                console.log('1');
            }   else if(update_tasks!=null && update_numbertasks!=null && Array.isArray(update_tasks) && update_numbertasks!=update_tasks.length){
                res.status(409).send("Error 409 : Something went wrong! (numbertasks error)");
            }   else if(update_tasks==null && update_numbertasks!=null && taskGroup_searched.tasks.length!=update_numbertasks){
                res.status(409).send("Error 409 : Something went wrong! (numbertasks error)");
            }   else if(update_tasks!=null && update_numbertasks==null && taskGroup_searched.tasks.length!=update_tasks.length){
                res.status(409).send("Error 409 : Something went wrong! (array error)");
            }
            else{

                let controllo1 = true
                let controllo2 = true

                if(update_tasks != null){
                    for(let i = 0; i<update_tasks.length; i++){
                        if(isNaN(update_tasks[i])){
                            controllo1 = false;
                        }
            
                        const controllo_task = db.getById('Task', update_tasks[i])
                        if(controllo_task == null){
                            controllo2 = false;
                        }
                    }
                }

                if(controllo1 && controllo2){

                    if(update_name!=null){
                        taskGroup_searched.name = update_name;
                    }

                    if(update_tasks!=null){
                        taskGroup_searched.tasks = update_tasks;
                    }

                    if(db.updateItem('TaskGroup', taskGroup_searched)){
                        res.status(200);
                        res.json(taskGroup_searched);
                        //console.log('TaskGroup has been updated successfully');
                    }else{
                        res.status(400).send("Error 400 : Update error!");
                    }

                }else{
                    if(!controllo1){
                        res.status(409).send("Error 409 : Something went wrong! (tasks array contains NaN object)");
                    }else{
                        res.status(409).send("Error 409 : Something went wrong! (tasks array contains invalid taskGroupID)");
                    }
                }
            }

        }

    })

    app.delete('/taskGroups/:taskGroupID' , (req, res) =>{

        if(!isNaN(req.params.taskGroupID) && req.params.taskGroupID>0){
            const taskGroup_searched = db.getById('TaskGroup', req.params.taskGroupID);
            if(taskGroup_searched == null){
                res.status(404).send('404 - We are sorry. No taskGroup found with given id');
            }else{
                db.deleteById('TaskGroup', req.params.taskGroupID);
                res.status(200).send('taskGroup deleted');
            }
        }else{
            res.status(404).send('404 - We are sorry. No taskGroup found with given id');
        }

    })
}
